CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- TENANTS (organizaciones)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USUARIOS CON ROL POR ORGANIZACION
CREATE TABLE org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'editor', 'viewer')) DEFAULT 'editor',
  UNIQUE(org_id, user_id)
);

-- PROYECTOS LXD
CREATE TABLE lxd_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL DEFAULT 'Nuevo Proyecto Educativo',
  strategy JSONB DEFAULT '{}'::jsonb,
  structure JSONB DEFAULT '[]'::jsonb,
  syllabus_blueprint JSONB,
  completion_rate INTEGER DEFAULT 0,
  total_scenes INTEGER DEFAULT 0,
  interactive_objects INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HISTORIAL DE CHAT POR PROYECTO
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES lxd_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE lxd_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- org_members: usuario solo ve su propia membresia
CREATE POLICY "org_members_select_own" ON org_members
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "organizations_select_member" ON organizations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM org_members om
      WHERE om.org_id = organizations.id
        AND om.user_id = auth.uid()
    )
  );

-- lxd_projects: usuario solo ve proyectos de su organizacion
CREATE POLICY "lxd_projects_select_org" ON lxd_projects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM org_members om
      WHERE om.org_id = lxd_projects.org_id
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "lxd_projects_update_org" ON lxd_projects
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM org_members om
      WHERE om.org_id = lxd_projects.org_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM org_members om
      WHERE om.org_id = lxd_projects.org_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'editor')
    )
  );

CREATE POLICY "lxd_projects_delete_org" ON lxd_projects
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM org_members om
      WHERE om.org_id = lxd_projects.org_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'editor')
    )
  );

-- INSERT: solo owner/editor pueden crear proyectos
CREATE POLICY "lxd_projects_insert_owner_editor" ON lxd_projects
  FOR INSERT
  WITH CHECK (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM org_members om
      WHERE om.org_id = lxd_projects.org_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'editor')
    )
  );

-- chat_messages: usuario solo ve mensajes de proyectos de su org
CREATE POLICY "chat_messages_select_org" ON chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM lxd_projects p
      JOIN org_members om ON om.org_id = p.org_id
      WHERE p.id = chat_messages.project_id
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "chat_messages_insert_org" ON chat_messages
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM lxd_projects p
      JOIN org_members om ON om.org_id = p.org_id
      WHERE p.id = chat_messages.project_id
        AND om.user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION set_lxd_project_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lxd_projects_updated_at
  BEFORE UPDATE ON lxd_projects
  FOR EACH ROW
  EXECUTE FUNCTION set_lxd_project_updated_at();

CREATE OR REPLACE FUNCTION get_or_create_personal_org(p_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id UUID;
  v_slug TEXT;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null';
  END IF;

  SELECT om.org_id
    INTO v_org_id
  FROM org_members om
  WHERE om.user_id = p_user_id
    AND om.role = 'owner'
  LIMIT 1;

  IF v_org_id IS NOT NULL THEN
    RETURN v_org_id;
  END IF;

  v_slug := 'personal-' || REPLACE(p_user_id::TEXT, '-', '');

  INSERT INTO organizations (name, slug)
  VALUES ('Personal Workspace', v_slug)
  ON CONFLICT (slug) DO UPDATE
    SET name = organizations.name
  RETURNING id INTO v_org_id;

  INSERT INTO org_members (org_id, user_id, role)
  VALUES (v_org_id, p_user_id, 'owner')
  ON CONFLICT (org_id, user_id) DO UPDATE
    SET role = 'owner';

  RETURN v_org_id;
END;
$$;

GRANT EXECUTE ON FUNCTION get_or_create_personal_org(UUID) TO authenticated;
