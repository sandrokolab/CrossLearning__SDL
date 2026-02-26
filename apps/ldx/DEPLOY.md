# Despliegue LXD4DL en Google Cloud Run

## 1. Prerrequisitos

- Proyecto GCP con APIs habilitadas: Cloud Build, Cloud Run, Secret Manager, Artifact/GCR.
- CLI autenticada: `gcloud auth login` y `gcloud config set project <PROJECT_ID>`.
- Supabase project configurado (Auth + DB + RLS).

## 2. Crear Secrets en Google Secret Manager

Ejecuta (reemplaza valores reales):

```bash
echo -n "<GOOGLE_GENERATIVE_AI_API_KEY>" | gcloud secrets create GOOGLE_GENERATIVE_AI_API_KEY --data-file=-
echo -n "<NEXT_PUBLIC_SUPABASE_URL>" | gcloud secrets create NEXT_PUBLIC_SUPABASE_URL --data-file=-
echo -n "<NEXT_PUBLIC_SUPABASE_ANON_KEY>" | gcloud secrets create NEXT_PUBLIC_SUPABASE_ANON_KEY --data-file=-
echo -n "<SUPABASE_SERVICE_ROLE_KEY>" | gcloud secrets create SUPABASE_SERVICE_ROLE_KEY --data-file=-
```

Si ya existen:

```bash
echo -n "<NEW_VALUE>" | gcloud secrets versions add <SECRET_NAME> --data-file=-
```

## 3. Conectar Supabase y ejecutar migrations

1. Configura variables en `.env.local`.
2. En Supabase SQL Editor ejecuta migraciones en orden (`supabase/migrations/*.sql`).
3. Verifica tablas/policies: `organizations`, `org_members`, `lxd_projects`, `chat_messages`.
4. Verifica RPC: `get_or_create_personal_org`.

## 4. Configurar Google OAuth redirect URLs

En Google Cloud Console (OAuth Client):

- URL local: `http://localhost:3000/auth/callback`
- URL producción (Cloud Run): `https://<SERVICE_URL>/auth/callback`

En Supabase Auth Providers (Google):

- agrega las mismas redirect URLs autorizadas.

## 5. Primer despliegue manual (Cloud Build)

Desde la raíz del proyecto (`ldx`):

```bash
gcloud builds submit --config cloudbuild.yaml .
```

La imagen se publica como:

- `gcr.io/$PROJECT_ID/ldx:$COMMIT_SHA`

El deploy de Cloud Run se realiza en `us-central1` con:

- `--memory=1Gi --cpu=1`
- `--min-instances=0 --max-instances=10`
- `--allow-unauthenticated`
- secrets inyectados desde Secret Manager.

## 6. Despliegue automático (CI/CD con GitHub Actions)

Workflow: `.github/workflows/deploy.yml`

Configura estos secrets en GitHub:

- `GCP_PROJECT_ID`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT_EMAIL`

Al hacer push a `main`, el workflow ejecuta:

```bash
gcloud builds submit --config cloudbuild.yaml .
```

## 7. Verificación post-deploy

- Health endpoint: `GET /api/health`
- Login Google funcional en dominio Cloud Run
- CRUD de proyectos y autosave OK
- Chat IA responde y guarda historial

## 8. Nota sobre configuración declarativa

También puedes desplegar con manifiesto:

- `deploy/cloudrun.yaml`

Aplicación:

```bash
gcloud run services replace deploy/cloudrun.yaml --region=us-central1
```

Antes de aplicarlo, reemplaza `PROJECT_ID` en la imagen.
