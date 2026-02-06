"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-gray-600 dark:text-purple-200 hover:text-purple-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-medium text-sm flex items-center gap-2"
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? <FaMoon size={16} /> : <FaSun size={16} />}
        </button>
    );
}
