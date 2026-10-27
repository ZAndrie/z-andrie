import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Expertise from "@/components/Expertise";
import Certificates from "@/components/Certificates";
import BlogSection from "@/components/BlogSection";
import Contact from "@/components/Contact";
import Global3DScene from "@/components/hero/Global3DScene";
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
