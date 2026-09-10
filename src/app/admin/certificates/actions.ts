"use server";

import { revalidatePath } from "next/cache";
import { getContentRepoName } from "@/lib/github";

interface UploadCertificateParams {
  title: string;
  issuer: string;
  date: string;
  fileName: string;
  fileBase64: string; // base64 string without data:... prefix
}

function getGitHubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ZAndrie-Portfolio-Admin",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// Determines where certificates.json is located (preferring certificates/certificates.json in unified repo)
async function resolveCertificatesJsonPath(username: string, repoName: string): Promise<string> {
  try {
    const checkSub = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/certificates/certificates.json`,
      { headers: getGitHubHeaders(), cache: "no-store" }
    );
    if (checkSub.ok) return "certificates/certificates.json";

    const checkRoot = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/certificates.json`,
      { headers: getGitHubHeaders(), cache: "no-store" }
    );
    if (checkRoot.ok) return "certificates.json";
  } catch {
    // fallback default
  }
  return "certificates/certificates.json";
}

export async function uploadCertificateToGitHub(params: UploadCertificateParams) {
  const username = process.env.GITHUB_USERNAME || "ZAndrie";
  const repoName = getContentRepoName();
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error: "GITHUB_TOKEN is missing in your environment variables. Please check your .env file or Vercel settings.",
    };
  }

  try {
    // 1. Sanitize file name
    const ext = params.fileName.split(".").pop()?.toLowerCase() || "png";
    const baseClean = params.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const cleanFileName = `${baseClean || "certificate"}.${ext}`;
    const filePath = `certificates/${cleanFileName}`;

    // 2. Check if image file already exists on GitHub to get its SHA (if overwriting)
    let existingFileSha: string | undefined = undefined;
    try {
      const checkRes = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`,
        { headers: getGitHubHeaders(), cache: "no-store" }
      );
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        existingFileSha = checkData.sha;
      }
    } catch {
      // file doesn't exist yet
    }

    // 3. Commit image file to GitHub
    const uploadImageRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          ...getGitHubHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload certificate: ${params.title}`,
          content: params.fileBase64,
          sha: existingFileSha,
          branch: "main",
        }),
      }
    );

    if (!uploadImageRes.ok) {
      const errData = await uploadImageRes.json();
      throw new Error(errData.message || `Failed to commit image (status: ${uploadImageRes.status})`);
    }

    // 4. Fetch existing certificates.json
    const jsonPath = await resolveCertificatesJsonPath(username, repoName);
    let certificatesJsonSha: string | undefined = undefined;
    let existingList: any[] = [];

    try {
      const jsonRes = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents/${jsonPath}`,
        { headers: getGitHubHeaders(), cache: "no-store" }
      );
      if (jsonRes.ok) {
        const jsonData = await jsonRes.json();
        certificatesJsonSha = jsonData.sha;
        if (jsonData.content) {
          const decoded = Buffer.from(jsonData.content, "base64").toString("utf-8");
          existingList = JSON.parse(decoded);
          if (!Array.isArray(existingList)) existingList = [];
        }
      }
    } catch {
      existingList = [];
    }

    // 5. Append or update the certificate in the list
    const rawImageUrl = `https://raw.githubusercontent.com/${username}/${repoName}/main/${filePath}`;
    const newCert = {
      id: `cert-${Date.now()}`,
      title: params.title,
      issuer: params.issuer,
      date: params.date,
      imageUrl: rawImageUrl,
      repoUrl: `https://github.com/${username}/${repoName}/blob/main/${filePath}`,
      order: existingList.length + 1,
    };

    existingList.push(newCert);

    // 6. Commit updated certificates.json to GitHub
    const updateJsonRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${jsonPath}`,
      {
        method: "PUT",
        headers: {
          ...getGitHubHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update certificates.json: Add ${params.title}`,
          content: Buffer.from(JSON.stringify(existingList, null, 2)).toString("base64"),
          sha: certificatesJsonSha,
          branch: "main",
        }),
      }
    );

    if (!updateJsonRes.ok) {
      const errData = await updateJsonRes.json();
      throw new Error(errData.message || `Failed to update certificates.json (status: ${updateJsonRes.status})`);
    }

    // 7. Revalidate Next.js cache
    revalidatePath("/admin/certificates");
    revalidatePath("/certificates");

    return { success: true, certificate: newCert };
  } catch (error: any) {
    console.error("Error uploading certificate to GitHub:", error);
    return { success: false, error: error.message || "Failed to commit certificate to GitHub" };
  }
}

interface UpdateCertificateParams {
  id: string;
  title: string;
  issuer: string;
  date: string;
  fileName?: string;
  fileBase64?: string;
}

export async function updateCertificateOnGitHub(params: UpdateCertificateParams) {
  const username = process.env.GITHUB_USERNAME || "ZAndrie";
  const repoName = getContentRepoName();
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error: "GITHUB_TOKEN is missing in your environment variables.",
    };
  }

  try {
    const jsonPath = await resolveCertificatesJsonPath(username, repoName);

    // 1. Fetch current certificates.json
    const jsonRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${jsonPath}`,
      { headers: getGitHubHeaders(), cache: "no-store" }
    );

    if (!jsonRes.ok) {
      throw new Error(`Could not find ${jsonPath} on GitHub repository ${repoName}`);
    }

    const jsonData = await jsonRes.json();
    let certificatesJsonSha = jsonData.sha;
    let list: any[] = [];
    if (jsonData.content) {
      const decoded = Buffer.from(jsonData.content, "base64").toString("utf-8");
      list = JSON.parse(decoded);
    }

    // 2. Find the certificate entry
    const certIndex = list.findIndex((c: any) => c.id === params.id);
    if (certIndex === -1) {
      throw new Error(`Certificate with id "${params.id}" not found in ${jsonPath}`);
    }

    let imageUrl = list[certIndex].imageUrl;

    // 3. If a new image file was provided, upload it
    if (params.fileBase64 && params.fileName) {
      const ext = params.fileName.split(".").pop()?.toLowerCase() || "png";
      const baseClean = params.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const cleanFileName = `${baseClean || "certificate"}.${ext}`;
      const filePath = `certificates/${cleanFileName}`;

      let existingFileSha: string | undefined = undefined;
      try {
        const checkRes = await fetch(
          `https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`,
          { headers: getGitHubHeaders(), cache: "no-store" }
        );
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          existingFileSha = checkData.sha;
        }
      } catch {
        // file doesn't exist yet
      }

      const uploadRes = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            ...getGitHubHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Update certificate image: ${params.title}`,
            content: params.fileBase64,
            sha: existingFileSha,
            branch: "main",
          }),
        }
      );

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.message || `Failed to commit image (status: ${uploadRes.status})`);
      }

      imageUrl = `https://raw.githubusercontent.com/${username}/${repoName}/main/${filePath}`;
    }

    // 4. Update the certificate metadata in the list
    list[certIndex] = {
      ...list[certIndex],
      title: params.title,
      issuer: params.issuer,
      date: params.date,
      imageUrl,
    };

    // 5. Commit updated certificates.json
    const updateJsonRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${jsonPath}`,
      {
        method: "PUT",
        headers: {
          ...getGitHubHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update certificate: ${params.title}`,
          content: Buffer.from(JSON.stringify(list, null, 2)).toString("base64"),
          sha: certificatesJsonSha,
          branch: "main",
        }),
      }
    );

    if (!updateJsonRes.ok) {
      const errData = await updateJsonRes.json();
      throw new Error(errData.message || `Failed to update ${jsonPath} (status: ${updateJsonRes.status})`);
    }

    revalidatePath("/admin/certificates");
    revalidatePath("/certificates");

    return { success: true, certificate: list[certIndex] };
  } catch (error: any) {
    console.error("Error updating certificate on GitHub:", error);
    return { success: false, error: error.message || "Failed to update certificate on GitHub" };
  }
}

export async function deleteCertificateFromGitHub(id: string) {
  const username = process.env.GITHUB_USERNAME || "ZAndrie";
  const repoName = getContentRepoName();
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error: "GITHUB_TOKEN is missing in your environment variables.",
    };
  }

  try {
    const jsonPath = await resolveCertificatesJsonPath(username, repoName);

    // 1. Fetch current certificates.json
    const jsonRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${jsonPath}`,
      { headers: getGitHubHeaders(), cache: "no-store" }
    );

    if (!jsonRes.ok) {
      throw new Error(`Could not find ${jsonPath} on GitHub repository ${repoName}`);
    }

    const jsonData = await jsonRes.json();
    const certificatesJsonSha = jsonData.sha;
    let list: any[] = [];
    if (jsonData.content) {
      const decoded = Buffer.from(jsonData.content, "base64").toString("utf-8");
      list = JSON.parse(decoded);
    }

    // 2. Filter out the certificate
    const updatedList = list.filter((c: any) => c.id !== id);

    // 3. Commit updated certificates.json back to GitHub
    const updateRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${jsonPath}`,
      {
        method: "PUT",
        headers: {
          ...getGitHubHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Remove certificate with ID ${id}`,
          content: Buffer.from(JSON.stringify(updatedList, null, 2)).toString("base64"),
          sha: certificatesJsonSha,
          branch: "main",
        }),
      }
    );

    if (!updateRes.ok) {
      const errData = await updateRes.json();
      throw new Error(errData.message || "Failed to update certificates.json on GitHub");
    }

    revalidatePath("/admin/certificates");
    revalidatePath("/certificates");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting certificate from GitHub:", error);
    return { success: false, error: error.message };
  }
}
