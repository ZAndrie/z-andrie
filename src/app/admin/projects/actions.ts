"use server";

import { revalidatePath } from "next/cache";
import { getContentRepoName } from "@/lib/github";
import fs from "fs";
import path from "path";

function saveLocalHiddenProjectId(id: string, hidden: boolean) {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "project-settings.json");
    let hiddenIds: string[] = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data.hiddenProjectIds)) {
        hiddenIds = data.hiddenProjectIds;
      }
    }
    const set = new Set(hiddenIds);
    const cleanId = id.replace(/^gh-/, "");

    if (hidden) {
      set.add(id);
      set.add(cleanId);
    } else {
      set.delete(id);
      set.delete(cleanId);
      for (const item of Array.from(set)) {
        if (item === id || item === cleanId || `gh-${item}` === id) {
          set.delete(item);
        }
      }
    }

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify({ hiddenProjectIds: Array.from(set) }, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to project-settings.json:", err);
  }
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
  hidden?: boolean;
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

    // Upload image if file was provided
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
            message: `Upload project image: ${cleanFileName}`,
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

    const newProject = {
      id: `proj-${Date.now()}`,
      title: data.title,
      category: data.category,
      subtitle: data.subtitle,
      imageUrl: finalImageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
      projectUrl: data.projectUrl || "",
      githubUrl: data.githubUrl || "",
      order: data.order !== undefined ? data.order : list.length + 1,
      hidden: Boolean(data.hidden),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
    hidden?: boolean;
  }
) {
  const username = process.env.GITHUB_USERNAME || "ZAndrie";
  const repoName = getContentRepoName();
  const token = process.env.GITHUB_TOKEN;

  if (data.hidden !== undefined) {
    saveLocalHiddenProjectId(id, data.hidden);
  }

  if (!token) {
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath("/works");
    revalidatePath("/");
    return {
      success: true,
      syncedToGitHub: false,
      message: "Visibility and changes saved locally! Add GITHUB_TOKEN to .env.local to commit to GitHub.",
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
        hidden: data.hidden !== undefined ? data.hidden : Boolean(list[index].hidden),
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
        hidden: Boolean(data.hidden),
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

export async function toggleProjectVisibility(
  id: string,
  hidden: boolean,
  meta?: {
    title?: string;
    category?: string;
    subtitle?: string;
    imageUrl?: string;
    githubUrl?: string;
    projectUrl?: string;
  }
): Promise<{
  success: boolean;
  hidden?: boolean;
  syncedToGitHub?: boolean;
  message?: string;
  warning?: string;
  error?: string;
}> {
  // 1. ALWAYS persist locally first so visibility changes take immediate effect
  saveLocalHiddenProjectId(id, hidden);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/works");

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    // Succeeded locally, non-blocking notice for remote sync
    return {
      success: true,
      hidden,
      syncedToGitHub: false,
      message: `Project visibility saved locally! (Add GITHUB_TOKEN to .env.local to commit live to GitHub)`,
    };
  }

  // 2. If GITHUB_TOKEN is present, also commit to portfolio-contents repo
  try {
    const username = process.env.GITHUB_USERNAME || "ZAndrie";
    const repoName = getContentRepoName();
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
        hidden,
        updatedAt: new Date().toISOString(),
      };
    } else {
      list.push({
        id,
        title: meta?.title || id,
        category: meta?.category || "Web Development",
        subtitle: meta?.subtitle || "",
        imageUrl: meta?.imageUrl || "",
        githubUrl: meta?.githubUrl || "",
        projectUrl: meta?.projectUrl || "",
        hidden,
        updatedAt: new Date().toISOString(),
        order: list.length + 1,
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
          message: `${hidden ? "Hide" : "Show"} project in portfolio: ${meta?.title || id}`,
          content: Buffer.from(JSON.stringify(list, null, 2)).toString("base64"),
          sha: projectsJsonSha,
          branch: "main",
        }),
      }
    );

    if (!updateRes.ok) {
      const errData = await updateRes.json().catch(() => ({}));
      return {
        success: true,
        hidden,
        syncedToGitHub: false,
        warning: `Saved locally, but remote GitHub sync reported: ${errData.message || updateRes.status}`,
      };
    }

    return {
      success: true,
      hidden,
      syncedToGitHub: true,
      message: `Project visibility updated and committed to GitHub!`,
    };
  } catch (error: any) {
    console.error("Error toggling project visibility on GitHub:", error);
    return {
      success: true,
      hidden,
      syncedToGitHub: false,
      warning: error.message || "Failed to commit visibility to GitHub, but saved locally.",
    };
  }
}
