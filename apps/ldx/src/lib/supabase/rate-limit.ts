import { createClient } from '@/lib/supabase/server';

interface RateLimitCheckParams {
  userId: string;
  route: string;
  limit: number;
  projectId?: string;
  orgId?: string;
}

function utcDayStartIso() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
}

export async function checkAndLogRateLimit({ userId, route, limit, projectId, orgId }: RateLimitCheckParams) {
  const supabase = await createClient();
  const since = utcDayStartIso();

  let query = supabase
    .from('api_request_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('route', route)
    .gte('created_at', since);

  if (projectId) {
    query = query.eq('project_id', projectId);
  }

  const { count, error: countError } = await query;

  if (countError) {
    return { allowed: false, error: 'No se pudo validar limite de uso.' } as const;
  }

  if ((count ?? 0) >= limit) {
    return { allowed: false, error: `Limite diario alcanzado para ${route}.` } as const;
  }

  const { error: insertError } = await supabase.from('api_request_logs').insert({
    user_id: userId,
    org_id: orgId ?? null,
    project_id: projectId ?? null,
    route,
  });

  if (insertError) {
    return { allowed: false, error: 'No se pudo registrar limite de uso.' } as const;
  }

  return { allowed: true } as const;
}
