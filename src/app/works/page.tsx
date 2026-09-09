import Portfolio from "@/components/Portfolio";
import { fetchGitHubProjects } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function WorksPage() {
  // Fetch live projects directly from GitHub
  const projects = await fetchGitHubProjects();

  return (
    <>
      <Portfolio projects={projects} />
    </>
  );
}
