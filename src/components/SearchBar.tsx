import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Ara..." }: SearchBarProps) {
    return (

        <div className="relative w-full group">

            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            </div>

            <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-800 rounded-xl leading-5 bg-gray-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all duration-300 shadow-lg"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}