"use client";

import { useState } from "react";
import { FaPlus, FaTrash, FaSave, FaCheck, FaClock, FaTimes } from "react-icons/fa";
import { updateTimeline } from "@/app/admin/actions";
import { toast } from "react-hot-toast";

interface TimelineItem {
    id: string | number;
    title: string;
    description?: string;
    date?: string;
    status: 'completed' | 'in_progress' | 'pending';
}

interface AdminTimelineEditorProps {
    projectId: string;
    initialTimeline: TimelineItem[] | null;
}

export default function AdminTimelineEditor({ projectId, initialTimeline }: AdminTimelineEditorProps) {
    const [timeline, setTimeline] = useState<TimelineItem[]>(Array.isArray(initialTimeline) ? initialTimeline : []);
    const [loading, setLoading] = useState(false);

    const handleAddItem = () => {
        const newItem: TimelineItem = {
            id: Date.now().toString(),
            title: "Yeni Aşama",
            description: "",
            date: "",
            status: "pending"
        };
        setTimeline([...timeline, newItem]);
    };

    const handleRemoveItem = (id: string | number) => {
        setTimeline(timeline.filter(item => item.id !== id));
    };

    const handleChange = (id: string | number, field: keyof TimelineItem, value: string) => {
        setTimeline(timeline.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("id", projectId);
            formData.append("timeline", JSON.stringify(timeline));

            const result = await updateTimeline(formData);
            if (result.success) {
                toast.success("Zaman çizelgesi güncellendi!");
            } else {
                toast.error("Güncelleme başarısız.");
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Proje Zaman Çizelgesi</h3>
                <button
                    onClick={handleAddItem}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-2"
                >
                    <FaPlus /> Yeni Ekle
                </button>
            </div>

            <div className="space-y-3">
                {timeline.length === 0 && (
                    <p className="text-gray-500 text-xs italic text-center py-4 border border-dashed border-gray-800 rounded-xl">
                        Henüz bir aşama eklenmedi.
                    </p>
                )}

                {timeline.map((item, index) => (
                    <div key={item.id} className="bg-black/40 border border-gray-800 p-4 rounded-xl flex flex-col gap-3 group">
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    value={item.title}
                                    onChange={(e) => handleChange(item.id, "title", e.target.value)}
                                    placeholder="Aşama Başlığı"
                                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none w-full"
                                />
                                <input
                                    value={item.date || ""}
                                    onChange={(e) => handleChange(item.id, "date", e.target.value)}
                                    placeholder="Tarih (Örn: 20 Ekim)"
                                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none w-full"
                                />
                            </div>
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-gray-600 hover:text-red-500 p-2 transition"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>

                        <div className="flex justify-between items-center gap-3">
                            <input
                                value={item.description || ""}
                                onChange={(e) => handleChange(item.id, "description", e.target.value)}
                                placeholder="Açıklama (Opsiyonel)"
                                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-300 focus:border-blue-500 outline-none flex-1"
                            />
                            <select
                                value={item.status}
                                onChange={(e) => handleChange(item.id, "status", e.target.value as any)}
                                className={`bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-xs font-bold outline-none cursor-pointer
                                    ${item.status === 'completed' ? 'text-green-500 border-green-500/30' :
                                        item.status === 'in_progress' ? 'text-blue-500 border-blue-500/30' : 'text-gray-500'}
                                `}
                            >
                                <option value="pending">Bekliyor</option>
                                <option value="in_progress">Devam Ediyor</option>
                                <option value="completed">Tamamlandı</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-gray-800">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                >
                    {loading ? "Kaydediliyor..." : <><FaSave /> Değişiklikleri Kaydet</>}
                </button>
            </div>
        </div>
    );
}
