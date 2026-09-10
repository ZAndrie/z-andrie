import Expertise from "@/components/Expertise";
import { fetchGitHubExpertise } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function ExpertisePage() {
  const items = await fetchGitHubExpertise();

  return (
    <>
      <Expertise initialItems={items} />
    </>
  );
}
