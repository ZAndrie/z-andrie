"use server";

import { revalidatePath } from "next/cache";

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

export async function createExpertiseItem(data: {
  category: string;
  title: string;
  subtitle?: string;
  year: string;
  percentage: string;
  order?: number;
}) {
  const username = process.env.GITHUB_USERNAME || "ZAndrie";
  const repoName = "Expertise-Repository";
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error: "GITHUB_TOKEN is missing in your environment variables.",
    };
  }

  try {
    // 1. Fetch current expertise.json from GitHub
    let expertiseJsonSha: string | undefined = undefined;
    let list: any[] = [];

    try {
      const res = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents/expertise.json`,
        { headers: getGitHubHeaders(), cache: "no-store" }
      );
      if (res.ok) {
        const jsonData = await res.json();
        expertiseJsonSha = jsonData.sha;
        if (jsonData.content) {
          const decoded = Buffer.from(jsonData.content, "base64").toString("utf-8");
          list = JSON.parse(decoded);
          if (!Array.isArray(list)) list = [];
        }
      }
    } catch {
      list = [];
    }

    // 2. Append new item
    const newItem = {
      id: `exp-${Date.now()}`,
      category: data.category,
      title: data.title,
      subtitle: data.subtitle || "",
      year: data.year,
      percentage: data.percentage,
      order: list.length + 1,
    };

    list.push(newItem);

    // 3. Commit updated expertise.json back to GitHub
    const updateRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/expertise.json`,
      {
        method: "PUT",
        headers: {
          ...getGitHubHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add expertise item: ${data.title}`,
          content: Buffer.from(JSON.stringify(list, null, 2)).toString("base64"),
          sha: expertiseJsonSha,
          branch: "main",
        }),
      }
    );

    if (!updateRes.ok) {
      const errData = await updateRes.json();
      throw new Error(errData.message || `Failed to commit to GitHub (status: ${updateRes.status})`);
    }

    revalidatePath("/admin/expertise");
    revalidatePath("/expertise");

    return { success: true, item: newItem };
  } catch (error: any) {
    console.error("Error creating expertise item on GitHub:", error);
    return { success: false, error: error.message || "Failed to commit item to GitHub" };
  }
}

export async function deleteExpertiseItem(id: string) {
  const username = process.env.GITHUB_USERNAME || "ZAndrie";
  const repoName = "Expertise-Repository";
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error: "GITHUB_TOKEN is missing in your environment variables.",
    };
  }

  try {
    // 1. Fetch current expertise.json
    const res = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/expertise.json`,
      { headers: getGitHubHeaders(), cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Could not find expertise.json on GitHub");
    }

    const jsonData = await res.json();
    const expertiseJsonSha = jsonData.sha;
    let list: any[] = [];
    if (jsonData.content) {
      const decoded = Buffer.from(jsonData.content, "base64").toString("utf-8");
      list = JSON.parse(decoded);
    }

    // 2. Filter out item
    const updatedList = list.filter((item: any) => item.id !== id);

    // 3. Commit updated expertise.json
    const updateRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/expertise.json`,
      {
        method: "PUT",
        headers: {
          ...getGitHubHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Delete expertise item ${id}`,
          content: Buffer.from(JSON.stringify(updatedList, null, 2)).toString("base64"),
          sha: expertiseJsonSha,
          branch: "main",
        }),
      }
    );

    if (!updateRes.ok) {
      const errData = await updateRes.json();
      throw new Error(errData.message || "Failed to update expertise.json on GitHub");
    }

    revalidatePath("/admin/expertise");
    revalidatePath("/expertise");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting expertise item from GitHub:", error);
    return { success: false, error: error.message };
  }
}

export async function updateExpertiseItem(id: string, data: {
  category: string;
  title: string;
  subtitle?: string;
  year: string;
  percentage: string;
  order?: number;
}) {
  const username = process.env.GITHUB_USERNAME || "ZAndrie";
  const repoName = "Expertise-Repository";
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error: "GITHUB_TOKEN is missing in your environment variables.",
    };
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/expertise.json`,
      { headers: getGitHubHeaders(), cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Could not find expertise.json on GitHub");
    }

    const jsonData = await res.json();
    const expertiseJsonSha = jsonData.sha;
    let list: any[] = [];
    if (jsonData.content) {
      const decoded = Buffer.from(jsonData.content, "base64").toString("utf-8");
      list = JSON.parse(decoded);
    }

    const index = list.findIndex((item: any) => item.id === id);
    if (index === -1) {
      throw new Error("Item not found");
    }

    list[index] = {
      ...list[index],
      category: data.category,
      title: data.title,
      subtitle: data.subtitle || "",
      year: data.year,
      percentage: data.percentage,
    };

    const updateRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/expertise.json`,
      {
        method: "PUT",
        headers: {
          ...getGitHubHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update expertise item: ${data.title}`,
          content: Buffer.from(JSON.stringify(list, null, 2)).toString("base64"),
          sha: expertiseJsonSha,
          branch: "main",
        }),
      }
    );

    if (!updateRes.ok) {
      const errData = await updateRes.json();
      throw new Error(errData.message || "Failed to update expertise.json on GitHub");
    }

    revalidatePath("/admin/expertise");
    revalidatePath("/expertise");

    return { success: true };
  } catch (error: any) {
    console.error("Error updating expertise item on GitHub:", error);
    return { success: false, error: error.message };
  }
}
