import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchGitHubBlogPosts } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, excerpt, content, coverImage } = body;

    const username = process.env.GITHUB_USERNAME || "ZAndrie";
    const token = process.env.GITHUB_TOKEN;
    const repoCandidates = ["Blogs-Repository", "blogs-repository", "blog", "Blog", "blogs", "articles"];

    if (!token) {
      return NextResponse.json({ message: "GITHUB_TOKEN is not configured" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const markdownContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${new Date().toISOString().split("T")[0]}"
category: "Web Development"
excerpt: "${(excerpt || "").replace(/"/g, '\\"')}"
coverImage: "${coverImage || ""}"
---

${content}
`;

    for (const repoName of repoCandidates) {
      try {
        const filePath = `${slug}.md`;
        const res = await fetch(
          `https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`,
          {
            method: "PUT",
            headers: {
              Accept: "application/vnd.github.v3+json",
              Authorization: `Bearer ${token}`,
              "User-Agent": "ZAndrie-Portfolio-Admin",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Add post: ${title}`,
              content: Buffer.from(markdownContent).toString("base64"),
              branch: "main",
            }),
          }
        );

        if (res.ok) {
          revalidatePath("/admin/blog");
          revalidatePath("/blog");
          return NextResponse.json({ success: true, slug }, { status: 201 });
        }
      } catch (e) {
        console.warn(`Error writing to ${repoName}:`, e);
      }
    }

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return NextResponse.json({ success: true, slug }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  const posts = await fetchGitHubBlogPosts();
  return NextResponse.json(posts);
}
