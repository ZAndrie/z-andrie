export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  published: boolean;
  createdAt: string;
}

export const blogPostsData: BlogPost[] = [
  {
    id: "post-1",
    title: "Building Modern Responsive Interfaces with Next.js and Tailwind CSS",
    slug: "building-modern-responsive-interfaces",
    excerpt: "Exploring the fundamental principles of crafting elegant, responsive user interfaces that perform flawlessly across devices.",
    content: `
      <h2>The Shift in Modern Web Design</h2>
      <p>Modern web engineering requires more than just making pages look visually appealing—it demands performant, accessible, and highly responsive user interfaces that scale across countless device form factors.</p>
      
      <h3>Key Focus Areas</h3>
      <ul>
        <li><strong>Fluid Typography & Layouts:</strong> Utilizing modern CSS units and flexbox/grid for seamless responsiveness.</li>
        <li><strong>Component-Driven Architecture:</strong> Breaking complex UIs into reusable, atomic React components.</li>
        <li><strong>Optimized Asset Loading:</strong> Leveraging Next.js image optimization for ultra-fast initial page loads.</li>
      </ul>

      <blockquote>"Design is not just what it looks like and feels like. Design is how it works."</blockquote>

      <p>By blending deliberate typography with fluid layout systems, we can create digital experiences that resonate with users and elevate brand identity.</p>
    `,
    coverImage: "/download/Development.jpg",
    published: true,
    createdAt: "2026-08-15T00:00:00.000Z",
  },
  {
    id: "post-2",
    title: "Why Developer Portfolios Should Connect Directly to Live GitHub Repositories",
    slug: "why-portfolios-should-connect-to-github",
    excerpt: "How automating your project showcase through GitHub APIs ensures your portfolio stays up-to-date with your latest code commits.",
    content: `
      <h2>Live Code Over Static Screenshots</h2>
      <p>For any software developer, maintaining a portfolio often leads to stale data when projects are manually copy-pasted into databases. Connecting your portfolio directly to GitHub’s API unlocks real-time sync with your actual codebase.</p>
      
      <h3>Benefits of a GitHub-Powered Portfolio</h3>
      <ul>
        <li><strong>Automatic Updates:</strong> As soon as you push a new repository or update a readme, it reflects on your website.</li>
        <li><strong>Verified Proof of Work:</strong> Visitors can inspect real code, commit history, and technical architecture directly.</li>
        <li><strong>Zero Database Overhead:</strong> Eliminates database maintenance, migrations, and downtime risks.</li>
      </ul>

      <p>Integrating GitHub directly into web applications exemplifies the power of API-first frontend design.</p>
    `,
    coverImage: "/download/Webdesign.jpg",
    published: true,
    createdAt: "2026-09-01T00:00:00.000Z",
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPostsData.find((post) => post.slug === slug && post.published);
}
