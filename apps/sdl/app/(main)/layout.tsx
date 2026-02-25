import { Navigation } from './navigation'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Navigation />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Planta Activa:</span>
                        <span className="text-slate-900 font-bold text-sm">Planta Monterrey</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">Usuario Demo</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black">Administrator</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-900 rounded-full" />
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
