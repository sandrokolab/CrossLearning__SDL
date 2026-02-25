'use client'

import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/lib/types'
import { cn } from '@/lib/utils'
import { User, GraduationCap, PenTool, ShieldCheck } from 'lucide-react'

const ROLES = [
    { id: 'Student', label: 'Operario / Estudiante', icon: GraduationCap, description: 'Acceda a sus cursos y progreso de planta' },
    { id: 'Educator', label: 'Educador', icon: User, description: 'Gestione sesiones en vivo y evalúe alumnos' },
    { id: 'Content Creator', label: 'Creador de Contenido', icon: PenTool, description: 'Genere material educativo con IA Studio' },
    { id: 'Administrator', label: 'Administrador', icon: ShieldCheck, description: 'Control global, analíticas y gestión de sitios' },
]

export function RoleSelectionClient() {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
    const router = useRouter()

    const handleContinue = () => {
        if (!selectedRole) return
        localStorage.setItem('sdl_user_role', selectedRole)

        if (selectedRole === 'Student') {
            router.push('/academy')
        } else if (selectedRole === 'Administrator') {
            router.push('/dashboard')
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto py-12 px-6 w-full space-y-12">
                <div className="space-y-4">
                    <Button variant="ghost" className="text-slate-400 p-0 hover:bg-transparent" onClick={() => router.back()}>
                        &larr; Volver a selección de sitio
                    </Button>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Seleccione su Perfil</h2>
                    <p className="text-slate-500 text-lg">Defina su rol para personalizar su experiencia en la plataforma</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ROLES.map((role) => (
                        <div
                            key={role.id}
                            onClick={() => setSelectedRole(role.id as UserRole)}
                            className={cn(
                                "group relative p-6 bg-white rounded-3xl border-2 transition-all cursor-pointer hover:shadow-xl flex items-start gap-4",
                                selectedRole === role.id
                                    ? "border-slate-900 bg-slate-900 text-white shadow-2xl"
                                    : "border-slate-100 text-slate-900"
                            )}
                        >
                            <div className={cn(
                                "p-3 rounded-2xl transition-colors",
                                selectedRole === role.id ? "bg-white/10" : "bg-slate-100"
                            )}>
                                <role.icon className="w-8 h-8" />
                            </div>
                            <div className="flex-1 pr-8">
                                <h3 className="font-bold text-xl">{role.label}</h3>
                                <p className={cn(
                                    "text-sm mt-1",
                                    selectedRole === role.id ? "text-slate-400" : "text-slate-500"
                                )}>
                                    {role.description}
                                </p>
                            </div>
                            {selectedRole === role.id && (
                                <div className="absolute right-6 top-6">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        className={cn(
                            "px-12 py-8 rounded-2xl text-lg font-bold transition-all",
                            selectedRole ? "bg-slate-900 text-white hover:scale-105" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        )}
                        disabled={!selectedRole}
                        onClick={handleContinue}
                    >
                        CONFIRMAR Y ENTRAR
                    </Button>
                </div>
            </div>
        </div>
    )
}
