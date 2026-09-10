import Portfolio from "@/components/Portfolio";
import { fetchGitHubProjects } from "@/lib/github";

export const revalidate = 60;

export default async function WorksPage() {
  // Fetch live projects directly from GitHub
  const projects = await fetchGitHubProjects();

  return (
    <>
      <Portfolio projects={projects} />
    </>
  );
}
