"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaClock, FaCalendarAlt, FaHourglassHalf } from "react-icons/fa";

interface TimelineItem {
    id: string | number;
    title: string;
    description?: string;
    date?: string;
    status: 'completed' | 'in_progress' | 'pending';
}

export default function ProjectTimeline({ timeline }: { timeline?: TimelineItem[] }) {
    if (!timeline || timeline.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 dark:bg-[#0f1115] rounded-2xl border border-gray-200 dark:border-gray-800 border-dashed">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCalendarAlt className="text-2xl text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Proje Planı Hazırlanıyor</h3>
                <p className="text-gray-500 text-sm mt-2">Yönetici tarafından proje takvimi oluşturulduğunda burada görünecek.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#0f1115] p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" /> Proje Takvimi
            </h3>

            <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 space-y-8">
                {timeline.map((item, index) => (
                    <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-8"
                    >
                        {/* NOKTA */}
                        <div className={`absolute -left-[9px] top-1 w-5 h-5 rounded-full border-2 bg-white dark:bg-black flex items-center justify-center
                            ${item.status === 'completed' ? 'border-green-500' :
                                item.status === 'in_progress' ? 'border-blue-500 animate-pulse' :
                                    'border-gray-300 dark:border-gray-700'}`}
                        >
                            {item.status === 'completed' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                            {item.status === 'in_progress' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                        </div>

                        {/* İÇERİK */}
                        <div className={`p-4 rounded-xl border transition-all hover:scale-[1.01]
                            ${item.status === 'in_progress' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/30' :
                                item.status === 'completed' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-500/30' :
                                    'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 opacity-70'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`font-bold text-sm ${item.status === 'completed' ? 'text-green-700 dark:text-green-400' : item.status === 'in_progress' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-400'}`}>
                                    {item.title}
                                </h4>
                                {item.date && (
                                    <span className="text-[10px] bg-white dark:bg-black/50 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-500">
                                        {new Date(item.date).toLocaleDateString('tr-TR')}
                                    </span>
                                )}
                            </div>
                            {item.description && <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>}

                            <div className="mt-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                {item.status === 'completed' && <><FaCheckCircle className="text-green-500" /> Tamamlandı</>}
                                {item.status === 'in_progress' && <><FaHourglassHalf className="text-blue-500" /> Sürüyor</>}
                                {item.status === 'pending' && <><FaClock className="text-gray-400" /> Bekliyor</>}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
