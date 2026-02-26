import { redirect } from 'next/navigation';

interface ProjectIndexPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectIndexPage({ params }: ProjectIndexPageProps) {
  const { id } = await params;
  redirect(`/projects/${id}/strategy`);
}
