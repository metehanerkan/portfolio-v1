import { FaRocket, FaTools } from 'react-icons/fa';

export default function MaintenancePage() {
    return (
        <main className="fixed inset-0 z-[9999] bg-[#030014] flex items-center justify-center p-6 overflow-hidden text-white">

            {/* --- ARKA PLAN EFEKTLERİ --- */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-purple-900/40 via-[#1a0b2e]/30 to-transparent blur-[80px]" />
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto space-y-8">

                {/* İKON ANIMASYONU */}
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-ping"></div>
                    <div className="relative w-full h-full bg-[#0a0a0a]/50 backdrop-blur-xl border border-purple-500/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                        <FaRocket className="text-5xl text-purple-300 drop-shadow-lg" />
                    </div>
                    {/* Küçük Tamir İkonu */}
                    <div className="absolute -bottom-2 -right-2 bg-yellow-500/20 border border-yellow-500/40 p-3 rounded-full backdrop-blur-md">
                        <FaTools className="text-xl text-yellow-400" />
                    </div>
                </div>

                {/* METİNLER */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                        Kısa Bir Mola.
                    </h1>
                    <p className="text-lg md:text-xl text-purple-200/60 leading-relaxed max-w-lg mx-auto">
                        Şu anda daha iyi bir deneyim için sistemlerimizi güncelliyoruz.
                        Roketleri yeniden ateşlemek üzereyiz, lütfen birazdan tekrar kontrol et! 🚀
                    </p>
                </div>

                {/* YÜKLENİYOR ÇUBUĞU */}
                <div className="w-full max-w-sm mx-auto h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-purple-600 to-indigo-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-[loading_2s_ease-in-out_infinite]"></div>
                </div>

            </div>
        </main>
    );
}