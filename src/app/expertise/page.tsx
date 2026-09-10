import Expertise from "@/components/Expertise";
import { fetchGitHubExpertise } from "@/lib/github";

export const revalidate = 60;

export default async function ExpertisePage() {
  const items = await fetchGitHubExpertise();

  return (
    <>
      <Expertise initialItems={items} />
    </>
  );
}
