'use client'

import { useEffect, useState } from 'react'
import { checkSystemHealth, SystemHealth, getSystemHistory } from '@/actions/system'
import { FaDatabase, FaGlobe, FaChartArea } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SystemHealthWidget() {
    const [health, setHealth] = useState<SystemHealth | null>(null)
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchHealth = async () => {
        const data = await checkSystemHealth()
        const hist = await getSystemHistory()
        setHealth(data)
        setHistory(hist)
        setLoading(false)
    }

    useEffect(() => {
        fetchHealth()
        const interval = setInterval(fetchHealth, 30000)
        return () => clearInterval(interval)
    }, [])

    if (loading) return <div className="animate-pulse bg-gray-900 h-64 rounded-2xl w-full border border-gray-800"></div>

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol Taraf: Anlık Durum */}
            <div className="space-y-4">
                <div className={`p-4 rounded-xl border flex items-center gap-4 transition ${health?.dbStatus === 'online' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <div className={`p-3 rounded-full ${health?.dbStatus === 'online' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        <FaDatabase size={20} />
                    </div>
                    <div>
                        <h4 className="text-gray-400 text-xs font-bold uppercase">Veritabanı</h4>
                        <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${health?.dbStatus === 'online' ? 'text-white' : 'text-red-500'}`}>
                                {health?.dbStatus === 'online' ? 'Online' : 'Offline'}
                            </span>
                            {health?.dbStatus === 'online' && (
                                <span className="text-xs text-green-400 font-mono">({health?.dbLatency}ms)</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-center gap-4 transition ${health?.apiStatus === 'online' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <div className={`p-3 rounded-full ${health?.apiStatus === 'online' ? 'bg-blue-500/20 text-blue-500' : 'bg-red-500/20 text-red-500'}`}>
                        <FaGlobe size={20} />
                    </div>
                    <div>
                        <h4 className="text-gray-400 text-xs font-bold uppercase">API / Network</h4>
                        <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${health?.apiStatus === 'online' ? 'text-white' : 'text-red-500'}`}>
                                {health?.apiStatus === 'online' ? 'Online' : 'Offline'}
                            </span>
                            {health?.apiStatus === 'online' && (
                                <span className="text-xs text-blue-400 font-mono">({health?.apiLatency}ms)</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sağ Taraf: Geçmiş Grafiği */}
            <div className="lg:col-span-2 bg-gray-900 p-4 rounded-xl border border-gray-800">
                <h4 className="text-gray-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
                    <FaChartArea /> Latency Geçmişi (ms)
                </h4>
                <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} tick={{ fill: '#9ca3af' }} />
                            <YAxis stroke="#9ca3af" fontSize={10} tick={{ fill: '#9ca3af' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="db" stroke="#10b981" strokeWidth={2} dot={false} name="DB" />
                            <Line type="monotone" dataKey="api" stroke="#3b82f6" strokeWidth={2} dot={false} name="API" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
