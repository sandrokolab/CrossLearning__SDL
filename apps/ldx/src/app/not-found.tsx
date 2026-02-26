import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Pagina no encontrada</h1>
        <p className="mt-2 text-sm text-slate-600">La ruta solicitada no existe o ya no esta disponible.</p>
        <Link href="/projects" className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Ir a proyectos
        </Link>
      </section>
    </main>
  );
}
