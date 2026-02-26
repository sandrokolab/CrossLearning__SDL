import type { User } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';

export interface ActiveOrganization {
  id: string;
  name: string;
  slug: string;
}

export interface AuthOrgContext {
  user: User;
  organization: ActiveOrganization;
}

export async function getAuthOrgContext(): Promise<AuthOrgContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: orgId, error: rpcError } = await supabase.rpc('get_or_create_personal_org', {
    p_user_id: user.id,
  });

  if (rpcError || !orgId) {
    throw new Error('No se pudo resolver la organizacion activa del usuario.');
  }

  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('id', orgId)
    .single();

  if (orgError || !organization) {
    throw new Error('No se pudo cargar la organizacion activa.');
  }

  return {
    user,
    organization,
  };
}
