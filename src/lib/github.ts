export interface GitHubProject {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  imageUrl: string;
  projectUrl?: string;
  githubUrl: string;
  stars: number;
  language?: string;
  topics?: string[];
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface GitHubCertificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  repoUrl?: string;
  order?: number;
}

export interface GitHubBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  published: boolean;
  createdAt: string;
  githubUrl?: string;
  editorType?: string;
}

export interface GitHubExpertiseItem {
  id: string;
  category: "skills" | "education" | "experience";
  title: string;
  subtitle?: string;
  year: string;
  percentage: string;
  order?: number;
}

interface RawGitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  topics?: string[];
  default_branch: string;
}

interface GitHubContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "file" | "dir";
}

// Beautify names into human readable titles
function formatTitle(name: string): string {
  return name
    .replace(/\.[^/.]+$/, "") // remove extension
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

// Format category for filtering
function determineCategory(language: string | null, topics?: string[]): string {
  if (topics && topics.length > 0) {
    const topTopic = topics[0].toLowerCase();
    if (["fullstack", "frontend", "backend", "web", "ai", "machine-learning", "mobile"].includes(topTopic)) {
      return topTopic.toUpperCase();
    }
  }

  if (!language) return "Web Development";
  const lang = language.toLowerCase();

  if (lang === "blade" || lang === "php") return "PHP / Blade";
  if (lang === "typescript") return "TypeScript";
  if (lang === "javascript") return "JavaScript";
  if (lang === "python") return "Python / AI";
  if (lang === "html" || lang === "css") return "Frontend";
  if (lang === "c++" || lang === "c" || lang === "c#") return "Software Dev";

  return language;
}

// Basic markdown to HTML parser for GitHub .md files
function simpleMarkdownToHtml(markdown: string): string {
  let html = markdown
    // Remove YAML frontmatter if present
    .replace(/^---[\s\S]*?---/, "")
    // Headers
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    // Blockquotes
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    // Bold / Italic
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    // Images
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" class="my-6 rounded-lg shadow" />')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noreferrer" class="text-[var(--color-primary)] underline">$1</a>')
    // Unordered lists
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/^\* (.*$)/gim, "<li>$1</li>")
    // Paragraphs
    .split("\n\n")
    .map((paragraph) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<li") ||
        trimmed.startsWith("<img")
      ) {
        return trimmed;
      }
      return `<p class="mb-6 leading-relaxed">${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ZAndrie-Portfolio",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

// ==========================================
// 1. PROJECTS (Live from GitHub Repositories)
// ==========================================
export async function fetchGitHubProjects(customUsername?: string): Promise<GitHubProject[]> {
  const username = customUsername || process.env.GITHUB_USERNAME || "ZAndrie";

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`,
      {
        headers: getHeaders(),
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.warn(`GitHub API responded with status ${response.status} for user ${username}`);
      return getFallbackProjects();
    }

    const repos: RawGitHubRepo[] = await response.json();

    if (!Array.isArray(repos)) {
      return getFallbackProjects();
    }

    const excludedRepos = [
      "certificates-repository",
      "certificates",
      "my-certificates",
      "blogs-repository",
      "blog-repository",
      "blogs",
      "blog",
      "articles",
      "posts",
      "z-andrie",
      "portfolio",
    ];

    const projectRepos = repos.filter((repo) => {
      const repoNameLower = repo.name.toLowerCase();
      if (excludedRepos.includes(repoNameLower)) {
        return false;
      }
      if (repo.name.toLowerCase() === username.toLowerCase() && repo.size < 50 && !repo.description) {
        return false;
      }
      return !repo.private && !repo.fork;
    });

    return projectRepos.map((repo, index) => {
      const title = formatTitle(repo.name);
      const category = determineCategory(repo.language, repo.topics);
      const subtitle =
        repo.description ||
        (repo.language
          ? `${repo.language} project featuring interactive design and robust system architecture.`
          : `Project repository developed by ${username}.`);

      const openGraphUrl = `https://opengraph.githubassets.com/1/${username}/${repo.name}`;

      return {
        id: `gh-${repo.id}`,
        title,
        category,
        subtitle,
        imageUrl: openGraphUrl,
        projectUrl: repo.homepage || repo.html_url,
        githubUrl: repo.html_url,
        stars: repo.stargazers_count || 0,
        language: repo.language || undefined,
        topics: repo.topics || [],
        createdAt: repo.created_at,
        updatedAt: repo.pushed_at || repo.updated_at,
        order: index + 1,
      };
    });
  } catch (error) {
    console.error("Failed to fetch GitHub projects:", error);
    return getFallbackProjects();
  }
}

// ==========================================
// 2. CERTIFICATES (From GitHub Repository)
// ==========================================
export async function fetchGitHubCertificates(customUsername?: string): Promise<GitHubCertificate[]> {
  const username = customUsername || process.env.GITHUB_USERNAME || "ZAndrie";
  const repoCandidates = ["Certificates-Repository", "certificates-repository", "certificates", "Certificates"];

  for (const repoName of repoCandidates) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents`,
        {
          headers: getHeaders(),
          cache: "no-store", // live refresh for immediate updates when user uploads
        }
      );

      if (response.ok) {
        const contents: GitHubContentItem[] = await response.json();
        if (Array.isArray(contents)) {
          // 1. Check for certificates.json or data.json
          const jsonFile = contents.find((c) => c.name.toLowerCase() === "certificates.json" || c.name.toLowerCase() === "data.json");
          if (jsonFile && jsonFile.download_url) {
            const jsonRes = await fetch(jsonFile.download_url, { cache: "no-store" });
            if (jsonRes.ok) {
              const data = await jsonRes.json();
              if (Array.isArray(data) && data.length > 0) return data;
            }
          }

          // 2. Scan image/pdf files in repository root
          const imageFiles: GitHubContentItem[] = contents.filter((c) =>
            /\.(png|jpg|jpeg|webp|pdf|svg)$/i.test(c.name)
          );

          // 3. Also check any subdirectories (e.g. certificates/, images/, certs/)
          const subdirs = contents.filter((c) => c.type === "dir");
          for (const dir of subdirs) {
            try {
              const subRes = await fetch(dir.url, { headers: getHeaders(), cache: "no-store" });
              if (subRes.ok) {
                const subItems: GitHubContentItem[] = await subRes.json();
                if (Array.isArray(subItems)) {
                  for (const subItem of subItems) {
                    if (/\.(png|jpg|jpeg|webp|pdf|svg)$/i.test(subItem.name)) {
                      imageFiles.push(subItem);
                    }
                  }
                }
              }
            } catch (err) {
              console.warn(`Error scanning subdir ${dir.name}:`, err);
            }
          }

          if (imageFiles.length > 0) {
            return imageFiles.map((file, index) => ({
              id: `cert-${file.sha}`,
              title: formatTitle(file.name),
              issuer: "Verified Credential",
              date: "GitHub Verified",
              imageUrl: file.download_url || `https://raw.githubusercontent.com/${username}/${repoName}/main/${file.path}`,
              repoUrl: file.html_url,
              order: index + 1,
            }));
          }

          // Repository is connected but no certificates uploaded yet
          return [];
        }
      }
    } catch (error) {
      console.warn(`Error querying certificates repository ${repoName}:`, error);
    }
  }

  return [];
}

// ==========================================
// 3. BLOG & ARTICLES (From GitHub Repository)
// ==========================================
export async function fetchGitHubBlogPosts(customUsername?: string): Promise<GitHubBlogPost[]> {
  const username = customUsername || process.env.GITHUB_USERNAME || "ZAndrie";
  const repoCandidates = ["Blogs-Repository", "blogs-repository", "blog", "Blog", "blogs", "articles", "posts"];

  for (const repoName of repoCandidates) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents`,
        {
          headers: getHeaders(),
          cache: "no-store",
        }
      );

      if (response.ok) {
        const contents: GitHubContentItem[] = await response.json();
        if (Array.isArray(contents) && contents.length > 0) {
          // Check for posts.json
          const jsonFile = contents.find((c) => c.name.toLowerCase() === "posts.json" || c.name.toLowerCase() === "articles.json");
          if (jsonFile && jsonFile.download_url) {
            const jsonRes = await fetch(jsonFile.download_url, { cache: "no-store" });
            if (jsonRes.ok) {
              const data = await jsonRes.json();
              if (Array.isArray(data) && data.length > 0) return data;
            }
          }

          // Scan markdown files
          const mdFiles = contents.filter((c) => /\.md$/i.test(c.name) && c.name.toLowerCase() !== "readme.md");

          if (mdFiles.length > 0) {
            const posts: GitHubBlogPost[] = [];

            for (const file of mdFiles) {
              if (file.download_url) {
                const mdRes = await fetch(file.download_url, { cache: "no-store" });
                if (mdRes.ok) {
                  const rawText = await mdRes.text();
                  const slug = file.name.replace(/\.md$/i, "").toLowerCase();
                  const firstHeadingMatch = rawText.match(/^#\s+(.*)$/m);
                  const title = firstHeadingMatch ? firstHeadingMatch[1] : formatTitle(file.name);

                  // Extract first paragraph for excerpt
                  const lines = rawText.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
                  const excerpt = lines[0] ? lines[0].replace(/[*_#`[\]]/g, "").slice(0, 160) + "..." : "Read full article on GitHub.";

                  posts.push({
                    id: `post-${file.sha}`,
                    title,
                    slug,
                    excerpt,
                    content: simpleMarkdownToHtml(rawText),
                    coverImage: `https://opengraph.githubassets.com/1/${username}/${repoName}`,
                    published: true,
                    createdAt: new Date().toISOString(),
                    githubUrl: file.html_url,
                  });
                }
              }
            }

            if (posts.length > 0) return posts;
          }

          return [];
        }
      }
    } catch (error) {
      console.warn(`Error querying blog repository ${repoName}:`, error);
    }
  }

  return [];
}

export async function fetchGitHubBlogPost(slug: string, customUsername?: string): Promise<GitHubBlogPost | undefined> {
  const posts = await fetchGitHubBlogPosts(customUsername);
  return posts.find((p) => p.slug.toLowerCase() === slug.toLowerCase() && p.published);
}

// Fallbacks
function getFallbackProjects(): GitHubProject[] {
  return [
    {
      id: "gh-fallback-1",
      title: "Library Booking System",
      category: "PHP / Blade",
      subtitle: "Full-stack reservation and booking system built with Blade and PHP.",
      imageUrl: "https://opengraph.githubassets.com/1/ZAndrie/Library-BookingSystem",
      projectUrl: "https://github.com/ZAndrie/Library-BookingSystem",
      githubUrl: "https://github.com/ZAndrie/Library-BookingSystem",
      stars: 0,
      language: "Blade",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 1,
    },
    {
      id: "gh-fallback-2",
      title: "Laptop Borrowing System",
      category: "JavaScript",
      subtitle: "Device inventory and reservation management platform.",
      imageUrl: "https://opengraph.githubassets.com/1/ZAndrie/Laptop-Borrowing-System",
      projectUrl: "https://github.com/ZAndrie/Laptop-Borrowing-System",
      githubUrl: "https://github.com/ZAndrie/Laptop-Borrowing-System",
      stars: 0,
      language: "JavaScript",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 2,
    },
    {
      id: "gh-fallback-3",
      title: "VaxCare",
      category: "TypeScript",
      subtitle: "Healthcare and vaccination management web application.",
      imageUrl: "https://opengraph.githubassets.com/1/ZAndrie/VaxCare",
      projectUrl: "https://github.com/ZAndrie/VaxCare",
      githubUrl: "https://github.com/ZAndrie/VaxCare",
      stars: 0,
      language: "TypeScript",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 3,
    },
    {
      id: "gh-fallback-4",
      title: "Emblemize AI",
      category: "Python / AI",
      subtitle: "AI application development project with emerging technologies.",
      imageUrl: "https://opengraph.githubassets.com/1/ZAndrie/EmblemizeAI",
      projectUrl: "https://github.com/ZAndrie/EmblemizeAI",
      githubUrl: "https://github.com/ZAndrie/EmblemizeAI",
      stars: 0,
      language: "Python",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 4,
    },
  ];
}

// ==========================================
// 4. EXPERTISE (From GitHub Repository)
// ==========================================
export async function fetchGitHubExpertise(customUsername?: string): Promise<GitHubExpertiseItem[]> {
  const username = customUsername || process.env.GITHUB_USERNAME || "ZAndrie";
  const repoCandidates = ["Expertise-Repository", "expertise-repository", "expertise", "Expertise"];

  for (const repoName of repoCandidates) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents`,
        {
          headers: getHeaders(),
          cache: "no-store",
        }
      );

      if (response.ok) {
        const contents: GitHubContentItem[] = await response.json();
        if (Array.isArray(contents)) {
          const jsonFile = contents.find(
            (c) =>
              c.name.toLowerCase() === "expertise.json" ||
              c.name.toLowerCase() === "data.json" ||
              c.name.toLowerCase() === "resume.json"
          );

          if (jsonFile && jsonFile.download_url) {
            const jsonRes = await fetch(jsonFile.download_url, { cache: "no-store" });
            if (jsonRes.ok) {
              const data = await jsonRes.json();
              if (Array.isArray(data)) return data;
            }
          }
        }
      }
    } catch (err) {
      console.error(`Error fetching expertise from repo ${repoName}:`, err);
    }
  }

  return [];
}

