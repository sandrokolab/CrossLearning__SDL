import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { type DashboardProject } from '@/app/(dashboard)/projects/actions';
import { ProjectShell } from '@/app/(dashboard)/projects/[id]/project-shell';
import { getAuthOrgContext } from '@/lib/supabase/auth-org';
import { createClient } from '@/lib/supabase/server';

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Proyecto',
  description: 'Flujo completo de diseno instruccional en 5 modulos',
  openGraph: {
    title: 'Proyecto LXD',
    description: 'Strategy, Design, Content, Journey y Production',
    images: ['/icon.svg'],
  },
};

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { id } = await params;
  const context = await getAuthOrgContext();

  if (!context) {
    redirect('/login');
  }

  const supabase = await createClient();
  const { data: project } = await supabase
    .from('lxd_projects')
    .select('*')
    .eq('id', id)
    .eq('org_id', context.organization.id)
    .single<DashboardProject>();

  if (!project) {
    notFound();
  }

  return <ProjectShell project={project}>{children}</ProjectShell>;
}
