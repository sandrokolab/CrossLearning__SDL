CREATE TABLE IF NOT EXISTS api_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES lxd_projects(id) ON DELETE CASCADE,
  route TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_request_logs_user_route_created_at
  ON api_request_logs (user_id, route, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_api_request_logs_project_route_created_at
  ON api_request_logs (project_id, route, created_at DESC);

ALTER TABLE api_request_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "api_request_logs_insert_own" ON api_request_logs
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "api_request_logs_select_own" ON api_request_logs
  FOR SELECT
  USING (user_id = auth.uid());
