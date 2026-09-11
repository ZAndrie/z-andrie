"use server";

import { revalidatePath } from "next/cache";
import { getContentRepoName } from "@/lib/github";

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

async function resolveProjectsJsonPath(username: string, repoName: string): Promise<string> {
  try {
    const checkSub = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/projects/projects.json`,
      { headers: getGitHubHeaders(), cache: "no-store" }
    );
    if (checkSub.ok) return "projects/projects.json";

    const checkRoot = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/projects.json`,
      { headers: getGitHubHeaders(), cache: "no-store" }
    );
    if (checkRoot.ok) return "projects.json";
  } catch {
    // fallback
  }
  return "projects/projects.json";
}

export async function createProject(data: {
  title: string;
  category: string;
  subtitle: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  fileName?: string;
  fileBase64?: string;
  order?: number;
}) {
  const username = process.env.GITHUB_USERNAME || "ZAndrie";
  const repoName = getContentRepoName();
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error: "GITHUB_TOKEN is missing in your environment variables. Please check your .env or Vercel settings.",
    };
  }

  try {
    let finalImageUrl = data.imageUrl || "";

    // If an image file was uploaded via base64, commit it directly to GitHub projects/ directory
    if (data.fileBase64 && data.fileName) {
      const ext = data.fileName.split(".").pop()?.toLowerCase() || "png";
      const baseClean = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const cleanFileName = `${baseClean || "project"}-${Date.now()}.${ext}`;
      const filePath = `projects/${cleanFileName}`;

      const uploadRes = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            ...getGitHubHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Upload project image: ${data.title}`,
            content: data.fileBase64,
            branch: "main",
          }),
        }
      );

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.message || `Failed to commit project image (status: ${uploadRes.status})`);
      }

      finalImageUrl = `https://raw.githubusercontent.com/${username}/${repoName}/main/${filePath}`;
    }

    if (!finalImageUrl) {
      finalImageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200";
    }

    const jsonPath = await resolveProjectsJsonPath(username, repoName);
    let projectsJsonSha: string | undefined = undefined;
    let list: any[] = [];

    try {
      const res = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents/${jsonPath}`,
        { headers: getGitHubHeaders(), cache: "no-store" }
      );
      if (res.ok) {
        const jsonData = await res.json();
        projectsJsonSha = jsonData.sha;
        if (jsonData.content) {
          const decoded = Buffer.from(jsonData.content, "base64").toString("utf-8");
          list = JSON.parse(decoded);
          if (!Array.isArray(list)) list = [];
        }
      }
    } catch {
      list = [];
    }

    const newProject = {
      id: `proj-${Date.now()}`,
      title: data.title,
      category: data.category,
      subtitle: data.subtitle,
      imageUrl: finalImageUrl,
      projectUrl: data.projectUrl || "",
      githubUrl: data.githubUrl || "",
      stars: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: list.length + 1,
    };

    list.push(newProject);

    const updateRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${jsonPath}`,
      {
        method: "PUT",
        headers: {
          ...getGitHubHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add project: ${data.title}`,
          content: Buffer.from(JSON.stringify(list, null, 2)).toString("base64"),
          sha: projectsJsonSha,
          branch: "main",
        }),
      }
    );

    if (!updateRes.ok) {
      const errData = await updateRes.json();
      throw new Error(errData.message || `Failed to update ${jsonPath} on GitHub`);
    }

    revalidatePath("/admin/projects");
    revalidatePath("/works");
    revalidatePath("/");

    return { success: true, project: newProject };
  } catch (error: any) {
    console.error("Error creating project on GitHub:", error);
    return { success: false, error: error.message || "Failed to create project" };
  }
}

export async function updateProject(
  id: string,
  data: {
    title: string;
    category: string;
    subtitle: string;
    imageUrl?: string;
    projectUrl?: string;
    githubUrl?: string;
    fileName?: string;
    fileBase64?: string;
    order?: number;
  }
) {
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
    let finalImageUrl = data.imageUrl || "";

    // Upload new image if file was provided
    if (data.fileBase64 && data.fileName) {
      const ext = data.fileName.split(".").pop()?.toLowerCase() || "png";
      const baseClean = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const cleanFileName = `${baseClean || "project"}-${Date.now()}.${ext}`;
      const filePath = `projects/${cleanFileName}`;

      const uploadRes = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            ...getGitHubHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Update project image: ${data.title}`,
            content: data.fileBase64,
            branch: "main",
          }),
        }
      );

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.message || `Failed to commit project image (status: ${uploadRes.status})`);
      }

      finalImageUrl = `https://raw.githubusercontent.com/${username}/${repoName}/main/${filePath}`;
    }

    const jsonPath = await resolveProjectsJsonPath(username, repoName);
    let projectsJsonSha: string | undefined = undefined;
    let list: any[] = [];

    try {
      const res = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents/${jsonPath}`,
        { headers: getGitHubHeaders(), cache: "no-store" }
      );
      if (res.ok) {
        const jsonData = await res.json();
        projectsJsonSha = jsonData.sha;
        if (jsonData.content) {
          const decoded = Buffer.from(jsonData.content, "base64").toString("utf-8");
          list = JSON.parse(decoded);
          if (!Array.isArray(list)) list = [];
        }
      }
    } catch {
      list = [];
    }

    const index = list.findIndex((p: any) => p.id === id);

    if (index !== -1) {
      list[index] = {
        ...list[index],
        title: data.title,
        category: data.category,
        subtitle: data.subtitle,
        imageUrl: finalImageUrl || list[index].imageUrl,
        projectUrl: data.projectUrl !== undefined ? data.projectUrl : list[index].projectUrl,
        githubUrl: data.githubUrl !== undefined ? data.githubUrl : list[index].githubUrl,
        updatedAt: new Date().toISOString(),
        order: data.order ?? list[index].order,
      };
    } else {
      // For GitHub repos that don't have an entry in projects.json yet, record the override
      list.push({
        id,
        title: data.title,
        category: data.category,
        subtitle: data.subtitle,
        imageUrl: finalImageUrl,
        projectUrl: data.projectUrl || "",
        githubUrl: data.githubUrl || "",
        updatedAt: new Date().toISOString(),
        order: data.order || (list.length + 1),
      });
    }

    const updateRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${jsonPath}`,
      {
        method: "PUT",
        headers: {
          ...getGitHubHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update project: ${data.title}`,
          content: Buffer.from(JSON.stringify(list, null, 2)).toString("base64"),
          sha: projectsJsonSha,
          branch: "main",
        }),
      }
    );

    if (!updateRes.ok) {
      const errData = await updateRes.json();
      throw new Error(errData.message || `Failed to update ${jsonPath} on GitHub`);
    }

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath("/works");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("Error updating project on GitHub:", error);
    return { success: false, error: error.message || "Failed to update project" };
  }
}
