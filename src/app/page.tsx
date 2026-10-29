import {
  Hero,
  About,
  Portfolio,
  Expertise,
  Certificates,
  BlogSection,
  Contact,
  Global3DScene,
} from "@/components";
import {
  fetchGitHubProjects,
  fetchGitHubExpertise,
  fetchGitHubCertificates,
  fetchGitHubBlogPosts,
} from "@/lib/github";

export const revalidate = 60;

export default async function Home() {
  // Fetch dynamic content from repositories with graceful fallbacks
  const [projects, expertise, certificates, posts] = await Promise.all([
    fetchGitHubProjects(),
    fetchGitHubExpertise(),
    fetchGitHubCertificates(),
    fetchGitHubBlogPosts(),
  ]);

  return (
    <>
      <Global3DScene />
      <Hero />
      <About />
      <Portfolio projects={projects} />
      <Expertise initialItems={expertise} />
      <Certificates certificates={certificates} />
      <BlogSection posts={posts} />
      <Contact />
    </>
  );
}
