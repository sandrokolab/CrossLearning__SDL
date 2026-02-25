'use client'

import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Site } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PortalSelectionClientProps {
    sites: Site[]
}

export function PortalSelectionClient({ sites }: PortalSelectionClientProps) {
    const [selectedSiteId, setSelectedSiteId] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleValidate = async () => {
        if (!selectedSiteId) return
        setIsLoading(true)

        // For now, we store in localStorage and navigate
        // In final version, this will be a Server Action
        localStorage.setItem('sdl_site_id', selectedSiteId)
        router.push('/role')
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
            {/* Visual Header */}
            <div className="relative h-[40vh] bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-5xl font-black tracking-tighter mb-2 italic">SDL</h1>
                    <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Smart Digital Learning</p>
                </div>
            </div>

            {/* Selection Card */}
            <div className="flex-1 -mt-10 px-4 flex justify-center">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-white/20">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-800">Selección de Sitio</h2>
                        <p className="text-slate-500 text-sm">Elija su planta o unidad operativa para continuar</p>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <select
                                className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-4 px-4 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent appearance-none text-lg font-medium transition-all"
                                value={selectedSiteId}
                                onChange={(e) => setSelectedSiteId(e.target.value)}
                            >
                                <option value="" disabled>Seleccione una planta...</option>
                                {sites.map(site => (
                                    <option key={site.id} value={site.id}>{site.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                className="flex-1 py-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                                onClick={() => setSelectedSiteId('')}
                            >
                                LIMPIAR
                            </Button>
                            <Button
                                className={cn(
                                    "flex-1 py-6 rounded-xl font-bold tracking-tight transition-all",
                                    selectedSiteId ? "bg-slate-900 hover:bg-black text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                )}
                                disabled={!selectedSiteId || isLoading}
                                onClick={handleValidate}
                            >
                                {isLoading ? 'CARGANDO...' : 'CONTINUAR'}
                            </Button>
                        </div>
                    </div>

                    <div className="text-center pt-8 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            &copy; 2026 SteelCore Industrial Systems
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
