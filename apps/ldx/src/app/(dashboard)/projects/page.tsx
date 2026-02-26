import { redirect } from 'next/navigation';

import { type DashboardProject } from '@/app/(dashboard)/projects/actions';
import { ProjectsClient } from '@/app/(dashboard)/projects/projects-client';
import { getAuthOrgContext } from '@/lib/supabase/auth-org';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const context = await getAuthOrgContext();

  if (!context) {
    redirect('/login');
  }

  const supabase = await createClient();

  const { data: projects } = await supabase
    .from('lxd_projects')
    .select('*')
    .eq('org_id', context.organization.id)
    .order('updated_at', { ascending: false })
    .returns<DashboardProject[]>();

  return <ProjectsClient projects={projects ?? []} />;
}
