'use server';

import { revalidatePath } from 'next/cache';

import { buildTemplateStructure, type ProjectTemplateKey } from '@/data/templates';
import { getAuthOrgContext } from '@/lib/supabase/auth-org';
import { createClient } from '@/lib/supabase/server';
import { calculateProjectMetrics } from '@/lib/utils/project-metrics';

interface ActionResult {
  error?: string;
  success: boolean;
}

export interface DashboardProject {
  id: string;
  org_id: string;
  title: string;
  strategy: Record<string, unknown>;
  structure: unknown[];
  syllabus_blueprint: Record<string, unknown> | null;
  completion_rate: number;
  total_scenes: number;
  interactive_objects: number;
  created_at: string;
  updated_at: string;
}

interface SaveProjectInput {
  strategy: Record<string, unknown>;
  structure: unknown[];
  syllabusBlueprint?: Record<string, unknown> | null;
}

async function resolveContext() {
  const context = await getAuthOrgContext();

  if (!context) {
    return { error: 'Sesion no valida.' } as const;
  }

  const supabase = await createClient();

  return {
    supabase,
    user: context.user,
    organization: context.organization,
  } as const;
}

async function getProjectInOrg(projectId: string, orgId: string) {
  const supabase = await createClient();

  return supabase
    .from('lxd_projects')
    .select('*')
    .eq('id', projectId)
    .eq('org_id', orgId)
    .single<DashboardProject>();
}

export async function createProject(templateKey?: ProjectTemplateKey): Promise<{ id?: string; error?: string }> {
  const context = await resolveContext();

  if ('error' in context) {
    return { error: context.error };
  }

  const structure = templateKey ? buildTemplateStructure(templateKey) : [];
  const metrics = calculateProjectMetrics(structure);

  const { data, error } = await context.supabase
    .from('lxd_projects')
    .insert({
      org_id: context.organization.id,
      owner_id: context.user.id,
      title: 'Nuevo Proyecto Educativo',
      structure,
      completion_rate: metrics.completionRate,
      total_scenes: metrics.totalScenes,
      interactive_objects: metrics.interactiveObjects,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { error: 'No se pudo crear el proyecto.' };
  }

  revalidatePath('/projects');

  return { id: data.id };
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  const context = await resolveContext();

  if ('error' in context) {
    return { success: false, error: context.error };
  }

  const { data: project } = await getProjectInOrg(projectId, context.organization.id);

  if (!project || project.org_id !== context.organization.id) {
    return { success: false, error: 'Proyecto no encontrado en tu organizacion.' };
  }

  const { error } = await context.supabase
    .from('lxd_projects')
    .delete()
    .eq('id', projectId)
    .eq('org_id', context.organization.id);

  if (error) {
    return { success: false, error: 'No se pudo eliminar el proyecto.' };
  }

  revalidatePath('/projects');

  return { success: true };
}

export async function duplicateProject(projectId: string): Promise<{ id?: string; error?: string }> {
  const context = await resolveContext();

  if ('error' in context) {
    return { error: context.error };
  }

  const { data: project, error: fetchError } = await getProjectInOrg(projectId, context.organization.id);

  if (fetchError || !project || project.org_id !== context.organization.id) {
    return { error: 'No se pudo cargar el proyecto a duplicar.' };
  }

  const metrics = calculateProjectMetrics(project.structure);

  const { data, error } = await context.supabase
    .from('lxd_projects')
    .insert({
      org_id: context.organization.id,
      owner_id: context.user.id,
      title: `${project.title} (Copia)`,
      strategy: project.strategy,
      structure: project.structure,
      syllabus_blueprint: project.syllabus_blueprint,
      completion_rate: metrics.completionRate,
      total_scenes: metrics.totalScenes,
      interactive_objects: metrics.interactiveObjects,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { error: 'No se pudo duplicar el proyecto.' };
  }

  revalidatePath('/projects');

  return { id: data.id };
}

export async function renameProject(projectId: string, title: string): Promise<ActionResult> {
  const context = await resolveContext();

  if ('error' in context) {
    return { success: false, error: context.error };
  }

  const sanitizedTitle = title.trim();

  if (sanitizedTitle.length < 3) {
    return { success: false, error: 'El titulo debe tener al menos 3 caracteres.' };
  }

  const { data: project } = await getProjectInOrg(projectId, context.organization.id);

  if (!project || project.org_id !== context.organization.id) {
    return { success: false, error: 'Proyecto no encontrado en tu organizacion.' };
  }

  const { error } = await context.supabase
    .from('lxd_projects')
    .update({ title: sanitizedTitle })
    .eq('id', projectId)
    .eq('org_id', context.organization.id);

  if (error) {
    return { success: false, error: 'No se pudo renombrar el proyecto.' };
  }

  revalidatePath('/projects');
  revalidatePath(`/projects/${projectId}`);

  return { success: true };
}

export async function saveProject(projectId: string, data: SaveProjectInput): Promise<ActionResult> {
  const context = await resolveContext();

  if ('error' in context) {
    return { success: false, error: context.error };
  }

  const { data: project, error: fetchError } = await getProjectInOrg(projectId, context.organization.id);

  if (fetchError || !project || project.org_id !== context.organization.id) {
    return { success: false, error: 'Proyecto no encontrado en tu organizacion.' };
  }

  const metrics = calculateProjectMetrics(data.structure);

  const { error } = await context.supabase
    .from('lxd_projects')
    .update({
      strategy: data.strategy,
      structure: data.structure,
      syllabus_blueprint: data.syllabusBlueprint ?? null,
      completion_rate: metrics.completionRate,
      total_scenes: metrics.totalScenes,
      interactive_objects: metrics.interactiveObjects,
    })
    .eq('id', projectId)
    .eq('org_id', context.organization.id);

  if (error) {
    return { success: false, error: 'No se pudo guardar el proyecto.' };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');

  return { success: true };
}
