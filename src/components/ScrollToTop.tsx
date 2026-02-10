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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: [0, -15, 0] // Smooth floating
                    }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                        y: {
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatType: "loop"
                        },
                        opacity: { duration: 0.3 }
                    }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-purple-600/80 dark:bg-purple-600/60 text-white rounded-full shadow-lg hover:shadow-purple-500/40 border border-white/20 hover:bg-purple-600 transition-all duration-300 hover:scale-110 backdrop-blur-md"
                    aria-label="Yukarı Çık"
                >
                    <FaArrowUp size={20} className="drop-shadow-md" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}