import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, BookOpen, Clock, Users } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Bienvenido, Operario</h2>
                <p className="text-slate-500 text-lg">Resumen de capacitación para Planta Monterrey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Progreso Total", value: "68%", icon: Activity, trend: "+12% esta semana", color: "text-blue-600" },
                    { title: "Cursos Activos", value: "4", icon: BookOpen, trend: "1 pendiente por vencer", color: "text-amber-600" },
                    { title: "Horas Aprendidas", value: "24.5", icon: Clock, trend: "+2h hoy", color: "text-emerald-600" },
                    { title: "Conexiones", value: "128", icon: Users, trend: "Personal en línea", color: "text-purple-600" },
                ].map((stat) => (
                    <Card key={stat.title} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
                                {stat.trend}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-slate-800">Cursos Recomendados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="group bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl transition-all cursor-pointer">
                                <div className="aspect-video bg-slate-100 rounded-2xl mb-4 overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 group-hover:scale-105 transition-transform" />
                                </div>
                                <h4 className="font-bold text-lg text-slate-900">Seguridad Industrial {i}</h4>
                                <p className="text-slate-500 text-sm mb-4">Procedimientos críticos para planta...</p>
                                <div className="flex justify-between items-center">
                                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-tighter text-slate-600">Tecnología</span>
                                    <button className="text-slate-900 font-bold text-sm hover:underline">Iniciar &rarr;</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
                    <h3 className="text-xl font-bold">Resumen de Actividad</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Completó Etapa Práctica</p>
                                    <p className="text-[10px] text-slate-400">Hace {i} horas</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold transition-all">
                        VER TODO EL HISTORIAL
                    </button>
                </div>
            </div>
        </div>
    )
}
