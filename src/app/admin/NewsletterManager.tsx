'use client'

import { useEffect, useState } from 'react'
import { sendNewsletter, getNewsletterStats, getSubscribers, unsubscribe } from '@/actions/newsletter'
import { FaPaperPlane, FaUsers, FaEnvelopeOpenText, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function NewsletterManager() {
    const [status, setStatus] = useState<'idle' | 'sending'>('idle')
    const [subscriberCount, setSubscriberCount] = useState<number | null>(null)
    const [subscribers, setSubscribers] = useState<any[]>([])
    const [loadingSubs, setLoadingSubs] = useState(true)

    const refreshData = () => {
        getNewsletterStats().then(data => setSubscriberCount(data.count))
        getSubscribers().then(data => {
            setSubscribers(data)
            setLoadingSubs(false)
        })
    }

    useEffect(() => {
        refreshData()
    }, [])

    const handleUnsubscribe = async (email: string) => {
        if (!confirm(`${email} adresini abonelikten çıkarmak istediğinize emin misiniz?`)) return

        const result = await unsubscribe(email)
        if (result.success) {
            toast.success('Abonelik iptal edildi.')
            refreshData()
        } else {
            toast.error('İşlem başarısız.')
        }
    }

    return (
        <div className="space-y-8">
            {/* Gönderim Formu */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-purple-500/20 text-purple-500 rounded-2xl">
                        <FaEnvelopeOpenText size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            E-Bülten Gönderimi
                            {subscriberCount !== null && (
                                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20 flex items-center gap-1">
                                    <FaUsers /> {subscriberCount} Abone
                                </span>
                            )}
                        </h3>
                        <p className="text-gray-400 text-sm">Aktif abonelerinize toplu mail gönderin. (Günlük limit: 100)</p>
                    </div>
                </div>

                <form action={async (formData) => {
                    setStatus('sending')
                    const toastId = toast.loading('Gönderiliyor...')

                    const result = await sendNewsletter(formData)

                    toast.dismiss(toastId)
                    setStatus('idle')

                    if (result.success) {
                        toast.success(`${result.count} kişiye başarıyla gönderildi! 🚀`)
                    } else {
                        toast.error(`Hata: ${result.error}`)
                    }
                }} className="space-y-6">

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Konu Başlığı</label>
                        <input
                            name="subject"
                            required
                            placeholder="Örn: Bu Haftanın En İyi Yazıları 📚"
                            className="w-full bg-black border border-gray-800 text-white p-4 rounded-xl focus:border-purple-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">İçerik (HTML Destekli)</label>
                        <textarea
                            name="content"
                            required
                            rows={6}
                            placeholder="<p>Merhaba arkadaşlar,</p><p>Bu hafta yeni bir proje yayınladım...</p>"
                            className="w-full bg-black border border-gray-800 text-white p-4 rounded-xl focus:border-purple-500 outline-none transition font-mono text-sm leading-relaxed"
                        />
                        <p className="text-gray-600 text-xs mt-2">
                            * HTML etiketlerini kullanabilirsiniz (`&lt;p&gt;`, `&lt;b&gt;`, `&lt;a&gt;` vb.)
                        </p>
                    </div>

                    <div className="pt-4 border-t border-gray-800 flex justify-end">
                        <button
                            disabled={status === 'sending'}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/20 disabled:opacity-50"
                        >
                            {status === 'sending' ? 'Gönderiliyor...' : <><FaPaperPlane /> Gönder</>}
                        </button>
                    </div>

                </form>
            </div>

            {/* Abone Listesi */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaUsers className="text-blue-500" /> Abone Listesi
                </h3>

                {loadingSubs ? (
                    <div className="text-center py-10 text-gray-500">Yükleniyor...</div>
                ) : subscribers.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">Henüz hiç abone yok.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                                    <th className="py-4 px-4">Email</th>
                                    <th className="py-4 px-4">Kayıt Tarihi</th>
                                    <th className="py-4 px-4">Durum</th>
                                    <th className="py-4 px-4 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribers.map((sub) => (
                                    <tr key={sub.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                                        <td className="py-4 px-4 text-white font-mono text-sm">{sub.email}</td>
                                        <td className="py-4 px-4 text-gray-400 text-sm">
                                            {new Date(sub.createdAt).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="py-4 px-4">
                                            {sub.isActive ? (
                                                <span className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full w-fit">
                                                    <FaCheckCircle /> Aktif
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-red-400 text-xs font-bold bg-red-500/10 px-2 py-1 rounded-full w-fit">
                                                    <FaTimesCircle /> İptal
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            {sub.isActive && (
                                                <button
                                                    onClick={() => handleUnsubscribe(sub.email)}
                                                    className="text-red-400 hover:text-white hover:bg-red-500 p-2 rounded-lg transition"
                                                    title="Aboneliği İptal Et"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
