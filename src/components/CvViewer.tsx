'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaFilePdf, FaDownload, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface CvViewerProps {
    cvUrl: string;
}

export default function CvViewer({ cvUrl }: CvViewerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Modal açıldığında scroll'u engelle
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8">
                    {/* Arka Plan Karartma */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
                    />

                    {/* Modal İçeriği */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-5xl h-[85vh] bg-[#0e0e11] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden z-10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 relative z-20">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <FaFilePdf className="text-purple-500" />
                                CV Önizleme
                            </h3>
                            <div className="flex items-center gap-2">
                                <a
                                    href={cvUrl}
                                    download
                                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition"
                                >
                                    <FaDownload /> İndir
                                </a>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>

                        {/* PDF Görüntüleyici */}
                        <div className="flex-1 bg-gray-900/50 relative z-10">
                            <iframe
                                src={`${cvUrl}#toolbar=0`}
                                className="w-full h-full border-none"
                                title="CV Preview"
                            />
                        </div>

                        {/* Mobil Alt Bar (İndirme için) */}
                        <div className="md:hidden p-4 border-t border-white/5 bg-[#0e0e11] relative z-20">
                            <a
                                href={cvUrl}
                                download
                                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition"
                            >
                                <FaDownload /> PDF Olarak İndir
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            {/* Tetikleyici Buton */}
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition shadow-lg shadow-purple-900/20 group"
            >
                <FaFilePdf className="group-hover:scale-110 transition-transform" />
                CV İncele
            </button>

            {/* Portal ile Body'ye render et */}
            {mounted ? createPortal(modalContent, document.body) : null}
        </>
    );
}
