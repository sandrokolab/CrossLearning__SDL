'use client';

import { useEffect } from 'react';

export default function ProjectsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
      <p className="font-semibold">Ocurrio un error al cargar proyectos.</p>
      <button type="button" onClick={reset} className="mt-3 rounded bg-red-700 px-3 py-1.5 text-sm text-white hover:bg-red-800">
        Reintentar
      </button>
    </div>
  );
}
