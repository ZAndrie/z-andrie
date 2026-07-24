import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const post = await prisma.post.findUnique({
    where: { slug }
  })

  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--color-light-bg)] pt-40 pb-32 relative">
      {/* Floating Back Button (Desktop) */}
      <div className="fixed top-28 left-4 md:left-8 z-40 hidden xl:block">
        <Link 
          href="/blog"
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-[var(--color-border)] opacity-80 hover:opacity-100"
        >
          <span className="text-lg leading-none font-light group-hover:-translate-x-1 transition-transform">←</span>
          Back
        </Link>
      </div>
      
      {/* Mobile Back Button (Top) */}
      <div className="xl:hidden w-[90%] md:w-[70%] max-w-[800px] mx-auto mb-8 flex justify-start">
        <Link 
          href="/blog"
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors group"
        >
          <span className="text-lg leading-none font-light group-hover:-translate-x-1 transition-transform">←</span>
          Back to all articles
        </Link>
      </div>

      <article className="w-full">
        
        {/* Header Section */}
        <header className="w-[90%] md:w-[70%] max-w-[800px] mx-auto text-center mb-16">
          <div className="text-[12px] text-[var(--color-primary)] uppercase tracking-[3px] font-bold mb-6">
            {new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-text-dark)] leading-tight mb-8">
            {post.title}
          </h1>
          <p className="text-[var(--color-text-light)] text-xl md:text-2xl font-light italic max-w-[600px] mx-auto">
            {post.excerpt}
          </p>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="w-[95%] md:w-[85%] max-w-[1200px] mx-auto relative h-[400px] md:h-[600px] mb-16 rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content Section */}
        <div className="w-[90%] md:w-[70%] max-w-[750px] mx-auto">
          <div 
            className="blog-content font-sans text-[var(--color-text-dark)] leading-[1.8] text-[18px] md:text-[20px] font-light"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

      </article>

      <style dangerouslySetInnerHTML={{__html: `
        /* Force override any inline colors from copy-pasting and prevent overflow */
        .blog-content {
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .blog-content,
        .blog-content * {
          color: #2b2b2b !important;
          max-width: 100%;
        }
        
        .blog-content h1, .blog-content h2, .blog-content h3 {
          font-family: var(--font-playfair), serif;
          color: #111 !important;
          margin-top: 2.5em;
          margin-bottom: 1em;
          line-height: 1.2;
          font-weight: normal;
        }
        .blog-content h1 { font-size: 2.5em; }
        .blog-content h2 { font-size: 2em; }
        .blog-content h3 { font-size: 1.5em; }
        
        .blog-content p {
          margin-bottom: 2em;
        }
        
        .blog-content a, .blog-content a * {
          color: var(--color-primary) !important;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        
        .blog-content ul, .blog-content ol {
          margin-bottom: 2em;
          padding-left: 1.5em;
        }
        .blog-content ul { list-style-type: disc; }
        .blog-content ol { list-style-type: decimal; }
        .blog-content li { margin-bottom: 0.8em; }
        
        .blog-content blockquote {
          border-left: 3px solid var(--color-primary);
          padding-left: 1.5em;
          margin: 2.5em 0;
          font-style: italic;
          color: #555 !important;
          font-size: 1.1em;
        }
        .blog-content blockquote * {
          color: #555 !important;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          margin: 3em auto;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
      `}} />
    </div>
  )
}
