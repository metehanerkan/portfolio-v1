'use client'

import { useEffect, useState } from 'react'
import { getAnalyticsStats } from '@/actions/analytics'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { FaChartLine, FaDesktop, FaGlobe, FaListOl, FaMapMarkerAlt, FaChrome, FaNetworkWired, FaGlobeAmericas } from 'react-icons/fa'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Detailed Analytics Component
export default function DetailedAnalytics() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState<'daily' | 'weekly'>('daily')

    useEffect(() => {
        const load = async () => {
            const data = await getAnalyticsStats()
            if (data) setStats(data)
            setLoading(false)
        }
        load()
    }, [])

    if (loading) return (
        <div className="w-full h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
    )

    if (!stats) return <div className="text-white">Veri yüklenemedi.</div>

    // Grafik verisini filtrele
    const chartData = timeRange === 'daily'
        ? stats.daily.slice(-7)
        : stats.daily; // Zaten 30 günlük geliyor

    return (
        <div className="space-y-8 animate-fadeIn pb-12">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Detaylı Trafik Analizi</h2>
                <span className="text-xs text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                    Son 30 Günlük Veri
                </span>
            </div>

            {/* Özet Kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-blue-500/50 transition">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-blue-500/20"></div>
                    <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Toplam Görüntüleme</span>
                    <span className="text-4xl font-bold text-white flex items-baseline gap-2">
                        {stats.pageViews}
                    </span>
                    <span className="text-xs text-blue-400 mt-2 block">Sayfa Yenilemeleri Dahil</span>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-purple-500/50 transition">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-purple-500/20"></div>
                    <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Tekil Ziyaretçi</span>
                    <span className="text-4xl font-bold text-white flex items-baseline gap-2">
                        {stats.uniqueVisitors}
                    </span>
                    <span className="text-xs text-purple-400 mt-2 block">Benzersiz IP Adresleri</span>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-green-500/50 transition">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-green-500/20"></div>
                    <span className="text-gray-500 text-xs font-bold uppercase block mb-1">En Popüler Ülke</span>
                    <span className="text-2xl font-bold text-white flex items-baseline gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        {stats.locations[0]?.country || '-'}
                    </span>
                    <span className="text-xs text-green-400 mt-2 block">
                        {stats.locations[0]?.count || 0} Ziyaret
                    </span>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-orange-500/50 transition">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-orange-500/20"></div>
                    <span className="text-gray-500 text-xs font-bold uppercase block mb-1">En Çok Gezilen</span>
                    <span className="text-xl font-bold text-white flex items-baseline gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        {stats.topPages[0]?.path || '/'}
                    </span>
                    <span className="text-xs text-orange-400 mt-2 block">
                        {stats.topPages[0]?.count || 0} Görüntüleme
                    </span>
                </div>
            </div>

            {/* Row 1: Trafik Trendi (Tam Genişlik) */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 min-h-[400px]">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-sm font-bold text-gray-400 flex items-center gap-2"><FaChartLine /> Trafik Trendi</h4>
                    <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800">
                        <button
                            onClick={() => setTimeRange('daily')}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition ${timeRange === 'daily' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            Haftalık
                        </button>
                        <button
                            onClick={() => setTimeRange('weekly')}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition ${timeRange === 'weekly' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            Aylık
                        </button>
                    </div>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                stroke="#9ca3af"
                                fontSize={10}
                                tickFormatter={(dateStr) => {
                                    const date = new Date(dateStr);
                                    if (timeRange === 'daily') {
                                        return date.toLocaleDateString('tr-TR', { weekday: 'short' });
                                    }
                                    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
                                }}
                            />
                            <YAxis stroke="#9ca3af" fontSize={10} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
                                itemStyle={{ color: '#fff' }}
                                labelFormatter={(label) => new Date(label).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Area type="monotone" dataKey="pageViews" name="Görüntüleme" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPv)" strokeWidth={3} />
                            <Area type="monotone" dataKey="uniqueVisitors" name="Tekil Ziyaretçi" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorUv)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 2: Teknoloji Yığını (3 Sütun: Tarayıcı, OS, Cihaz) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarayıcılar */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 min-h-[400px]">
                    <h4 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2"><FaChrome /> Tarayıcı Dağılımı</h4>
                    <div className="h-[300px] flex flex-col items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 20 }}>
                                <Pie
                                    data={stats.browsers}
                                    cx="50%"
                                    cy={110}
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                    nameKey="name"
                                    stroke="none"
                                    cornerRadius={4}
                                >
                                    {stats.browsers.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: number | undefined, name: any) => [`${value || 0} Ziyaret`, name]}
                                />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '11px', outline: 'none' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* İşletim Sistemleri */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 min-h-[400px]">
                    <h4 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2"><FaDesktop /> İşletim Sistemi</h4>
                    <div className="h-[300px] flex flex-col items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 20 }}>
                                <Pie
                                    data={stats.os}
                                    cx="50%"
                                    cy={110}
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                    nameKey="name"
                                    stroke="none"
                                    cornerRadius={4}
                                >
                                    {stats.os?.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />)}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: number | undefined, name: any) => [`${value || 0} Ziyaret`, name]}
                                />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '11px', outline: 'none' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cihazlar */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 min-h-[400px]">
                    <h4 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2"><FaListOl /> Cihaz Dağılımı</h4>
                    <div className="h-[300px] flex flex-col items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 20 }}>
                                <Pie
                                    data={stats.devices}
                                    cx="50%"
                                    cy={110}
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                    nameKey="name"
                                    stroke="none"
                                    cornerRadius={4}
                                >
                                    {stats.devices.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />)}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: number | undefined, name: any) => [`${value || 0} Ziyaret`, name]}
                                />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '11px', outline: 'none' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Row 3: Konum Detayları ve En Çok Gezilen Sayfalar (3 Sütun) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coğrafi Dağılım (Ülke) */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden h-fit">
                    <div className="p-4 border-b border-gray-800 bg-gray-950/50 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2"><FaGlobe /> Ülke Dağılımı</h4>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {stats.locations.map((loc: any, index: number) => {
                            const countryCode = loc.country;
                            let countryName = loc.country || 'Bilinmiyor';
                            let IconDisplay = null;

                            if (countryCode === 'Yerel Ağ (Dev)') {
                                IconDisplay = <FaNetworkWired className="text-cyan-400 text-xs" />;
                                countryName = 'Yerel Ağ';
                            } else if (!countryCode || countryCode === 'Bilinmiyor') {
                                IconDisplay = <FaGlobeAmericas className="text-gray-500 text-xs" />;
                                countryName = 'Bilinmiyor';
                            } else if (countryCode && countryCode.length === 2) {
                                try {
                                    const regionNames = new Intl.DisplayNames(['tr'], { type: 'region' });
                                    countryName = regionNames.of(countryCode);
                                } catch (e) {
                                    // Fallback to code if Intl fails
                                }
                            }

                            const percentage = (loc.count / stats.pageViews) * 100;

                            return (
                                <div key={index} className="p-4 hover:bg-gray-800/50 transition">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-4 flex items-center justify-center rounded overflow-hidden relative shadow-sm bg-gray-800/50">
                                                {IconDisplay ? IconDisplay : (countryCode && countryCode.length === 2 ? (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img
                                                        src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
                                                        alt={countryName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FaGlobeAmericas className="text-gray-500 text-xs" />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-200 font-medium">{countryName}</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-400">
                                            {loc.count}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                        {stats.locations.length === 0 && <p className="p-4 text-center text-gray-500 text-sm">Veri yok.</p>}
                    </div>
                </div>

                {/* Şehir Dağılımı */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden h-fit">
                    <div className="p-4 border-b border-gray-800 bg-gray-950/50 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2"><FaMapMarkerAlt /> Şehir Bazlı Dağılım</h4>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {stats.cities?.map((city: any, index: number) => {
                            const percentage = (city.count / stats.pageViews) * 100;
                            return (
                                <div key={index} className="p-4 hover:bg-gray-800/50 transition">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800 text-gray-500'}`}>
                                                {index + 1}
                                            </span>
                                            <span className="text-sm text-gray-200 font-medium">{city.city || 'Bilinmiyor'}</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-400">
                                            {city.count}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                        {(!stats.cities || stats.cities.length === 0) && <p className="p-4 text-center text-gray-500 text-sm">Veri yok.</p>}
                    </div>
                </div>

                {/* En Çok Gezilen Sayfalar */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden h-fit">
                    <div className="p-4 border-b border-gray-800 bg-gray-950/50 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2"><FaListOl /> En Çok Gezilen Sayfalar</h4>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {stats.topPages.map((page: any, index: number) => (
                            <div key={index} className="p-3 flex items-center justify-between hover:bg-gray-800/50 transition">
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-500'}`}>
                                        {index + 1}
                                    </span>
                                    <span className="text-sm text-gray-300 font-mono">{page.path}</span>
                                </div>
                                <span className="text-xs font-bold text-gray-400 bg-gray-950 px-2 py-1 rounded border border-gray-800">
                                    {page.count}
                                </span>
                            </div>
                        ))}
                        {stats.topPages.length === 0 && <p className="p-4 text-center text-gray-500 text-sm">Veri yok.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
