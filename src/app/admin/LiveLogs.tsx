'use client'

import { useEffect, useState } from 'react'
import { getLogs, clearLogs } from '@/actions/logger'
import { motion, AnimatePresence } from 'framer-motion' // Framer Motion yüklü demiştin

// Tip tanımlaması (Prisma'dan otomatik de alabilirsin ama manuel yazalım anlaşılır olsun)
type Log = {
    id: string
    level: string
    message: string
    source: string | null
    createdAt: Date
}

export default function LiveLogs() {
    const [logs, setLogs] = useState<Log[]>([])
    const [loading, setLoading] = useState(true)

    // Verileri çekme fonksiyonu
    const fetchLogs = async () => {
        const data = await getLogs()
        setLogs(data)
        setLoading(false)
    }

    // Canlı hissi vermek için her 5 saniyede bir yenile (Polling)
    useEffect(() => {
        fetchLogs()
        const interval = setInterval(fetchLogs, 5000)
        return () => clearInterval(interval)
    }, [])

    // Renk kodları
    const getColor = (level: string) => {
        switch (level) {
            case 'ERROR': return 'text-red-500'
            case 'WARNING': return 'text-yellow-400'
            case 'SUCCESS': return 'text-green-400'
            default: return 'text-blue-400' // INFO
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-gray-900 rounded-lg shadow-xl border border-gray-800 font-mono text-sm">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h3 className="text-gray-300 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Canlı Sistem Logları
                </h3>
                <button
                    onClick={() => clearLogs().then(fetchLogs)}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                    [Terminali Temizle]
                </button>
            </div>

            <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent space-y-2">
                {loading ? (
                    <p className="text-gray-500 animate-pulse">Sistem taranıyor...</p>
                ) : (
                    <AnimatePresence>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-3 items-start border-l-2 border-gray-800 pl-2 hover:bg-gray-800/50 p-1 rounded"
                            >
                                <span className="text-gray-600 text-xs min-w-[80px]">
                                    {new Date(log.createdAt).toLocaleTimeString()}
                                </span>
                                <span className={`font-bold text-xs min-w-[60px] ${getColor(log.level)}`}>
                                    [{log.level}]
                                </span>
                                <span className="text-gray-300 flex-1 break-all">
                                    {log.message}
                                </span>
                                {log.source && (
                                    <span className="text-gray-600 text-xs">
                                        @{log.source}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {logs.length === 0 && !loading && (
                    <p className="text-gray-600 italic">Sistem stabil. Kayıt yok.</p>
                )}
            </div>
        </div>
    )
}