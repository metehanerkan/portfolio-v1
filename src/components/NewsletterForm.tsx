'use client'

import { useState } from 'react'
import { subscribeToNewsletter } from '@/actions/newsletter'
import { FaPaperPlane, FaCheck } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function NewsletterForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

    return (
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
            {/* Arka Plan Efekti */}
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition duration-1000" />

            <div className="md:flex items-center justify-between gap-8">
                <div className="mb-6 md:mb-0 max-w-lg">
                    <h3 className="text-2xl font-bold text-white mb-2">Bültene Abone Ol 🚀</h3>
                    <p className="text-gray-400">
                        Yeni projelerimden, blog yazılarımdan ve teknoloji dünyasından notlardan haberdar olmak için katıl.
                    </p>
                </div>

                <div className="w-full max-w-md">
                    {status === 'success' ? (
                        <div className="bg-green-500/20 border border-green-500/50 p-4 rounded-xl flex items-center gap-3 text-green-400 animate-fadeIn">
                            <FaCheck className="flex-shrink-0" />
                            <span>Harika! Listeye başarıyla eklendin. 🎉</span>
                        </div>
                    ) : (
                        <form action={async (formData) => {
                            const email = formData.get('email') as string
                            const honeypot = formData.get('confirmEmail') as string
                            if (!email) return

                            setStatus('loading')
                            const result = await subscribeToNewsletter(email, honeypot)

                            if (result.success) {
                                setStatus('success')
                                toast.success('Abonelik başarılı!')
                            } else {
                                setStatus('idle')
                                toast.error(result.error || 'Bir hata oluştu.')
                            }
                        }} className="flex flex-col sm:flex-row gap-3">
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="E-posta adresin..."
                                className="flex-1 bg-black/50 border border-white/10 text-white px-5 py-4 rounded-xl focus:border-purple-500 focus:bg-black outline-none transition backdrop-blur-sm"
                            />
                            {/* Honeypot Field */}
                            <input
                                name="confirmEmail"
                                type="text"
                                style={{ display: 'none' }}
                                tabIndex={-1}
                                autoComplete="off"
                            />
                            <button
                                disabled={status === 'loading'}
                                className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-white/5 disabled:opacity-50 whitespace-nowrap"
                            >
                                {status === 'loading' ? '...' : <><FaPaperPlane /> Katıl</>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div >
    )
}
