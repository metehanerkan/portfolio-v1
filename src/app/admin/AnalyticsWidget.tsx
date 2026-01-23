'use client'

import { useEffect, useState } from 'react'
import { getAnalyticsStats } from '@/actions/analytics'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts'
import { FaChartLine, FaDesktop, FaGlobe } from 'react-icons/fa'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsWidget() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            const data = await getAnalyticsStats()
            if (data) setStats(data)
            setLoading(false)
        }
        load()
    }, [])

    if (loading) return <div className="animate-pulse bg-gray-900 h-[300px] w-full rounded-2xl border border-gray-800"></div>

    if (!stats) return null

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaChartLine className="text-purple-500" /> Trafik Analizi
            </h3>

            {/* Özet Kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                    <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Toplam Ziyaret (Son 1000)</span>
                    <span className="text-2xl font-bold text-white">{stats.total}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Günlük Ziyaret Grafiği */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 min-h-[300px]">
                    <h4 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2"><FaChartLine /> Son 7 Gün</h4>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.daily}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cihaz Dağılımı */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 min-h-[300px]">
                    <h4 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2"><FaDesktop /> Cihazlar</h4>
                    <div className="h-[200px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.devices}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.devices.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
