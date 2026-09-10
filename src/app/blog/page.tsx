import { fetchGitHubBlogPosts } from "@/lib/github"
import AnimatedBlogList from "./AnimatedBlogList"

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await fetchGitHubBlogPosts();

  return (
    <div className="min-h-screen bg-[var(--color-light-bg)] pt-32 pb-20">
      <div className="w-[90%] md:w-[85%] max-w-[1200px] mx-auto">
        <header className="mb-16">
          <p className="text-[12px] uppercase text-[var(--color-primary)] tracking-[2px] font-bold mb-4">
            Blog & Updates
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-dark)] leading-tight">
            Read My Latest <br />
            Thoughts and Articles.
          </h1>
        </header>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-8 bg-white/60 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[var(--color-light-bg)] flex items-center justify-center text-[var(--color-primary)] text-xl mb-5 border border-[var(--color-border)]">
              ✦
            </div>
            <h3 className="text-xl md:text-2xl font-serif text-[var(--color-text-dark)] mb-3">
              Articles & Publications
            </h3>
            <p className="text-[14px] text-[var(--color-text-light)] max-w-lg font-light leading-relaxed mb-6">
              New articles, technical case studies, and insights are currently being written and published. Check back soon for fresh updates.
            </p>
          </div>
        ) : (
          <AnimatedBlogList posts={posts} />
        )}
      </div>
    </div>
  )
}
