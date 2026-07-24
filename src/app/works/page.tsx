import Portfolio from "@/components/Portfolio";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <Portfolio projects={projects} />
    </>
  );
}
