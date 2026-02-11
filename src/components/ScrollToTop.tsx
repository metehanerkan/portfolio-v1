'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);


        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }}
                    exit={{ opacity: 0, scale: 0.5, y: 50 }}
                    transition={{
                        type: "spring", stiffness: 200, damping: 20
                    }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-[60] w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-full shadow-xl border border-white/20 cursor-pointer group hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all duration-300 backdrop-blur-md"
                    aria-label="Yukarı Çık"
                >
                    <div className="absolute inset-0 rounded-full bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <FaArrowUp size={18} className="drop-shadow-sm relative z-10 group-hover:-translate-y-1 transition-transform" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}