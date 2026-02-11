import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Ara..." }: SearchBarProps) {
    return (

        <div className="relative w-full group">
            {/* Glow Effect */}
            {/* Glow Effect Removed */}

            <div className="relative flex items-center bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl transition-all duration-300 group-focus-within:bg-white dark:group-focus-within:bg-black/60 group-focus-within:border-purple-500/50 group-focus-within:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                <div className="pl-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300">
                    <FaSearch className="text-lg" />
                </div>

                <input
                    type="text"
                    className="w-full py-4 px-4 bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 font-medium transition-all"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}