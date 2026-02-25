'use client'

import React from 'react'
import {
    LayoutDashboard,
    Library,
    MessageSquare,
    PenTool,
    BarChart3,
    Smartphone,
    LogOut,
    Settings
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Portal Cursos', icon: Library, href: '/courses' },
    { label: 'Live Session', icon: MessageSquare, href: '/live' },
    { label: 'Studio IA', icon: PenTool, href: '/creator' },
    { label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { label: 'Comunidad', icon: MessageSquare, href: '/social' },
    { label: 'Mobile App', icon: Smartphone, href: '/mobile' },
]

export function Navigation() {
    const pathname = usePathname()

    return (
        <nav className="w-64 bg-slate-900 text-white flex flex-col h-screen shrink-0">
            <div className="p-8">
                <h2 className="text-3xl font-black italic tracking-tighter">SDL</h2>
            </div>

            <div className="flex-1 px-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                            pathname === item.href
                                ? "bg-white/10 text-white"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-white/5 space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <Settings className="w-5 h-5" />
                    Configuración
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all">
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    )
}
