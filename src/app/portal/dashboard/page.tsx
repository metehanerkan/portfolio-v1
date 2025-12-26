import { redirect } from 'next/navigation';
import { getProjectByCode } from './actions';
import { FaCheckCircle, FaRocket, FaMoneyBillWave, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';

// Bileşenleri İmport Ediyoruz
import ProposalView from './ProposalView';
import ProjectStatusView from './ProjectStatusView';
import BriefForm from './BriefForm'; // Eğer BriefForm dosyan varsa burayı aç

interface PageProps {
    searchParams: Promise<{ code?: string }>;
}

export default async function DashboardPage(props: PageProps) {
    const { code } = await props.searchParams;

    if (!code) redirect('/portal');
    const project = await getProjectByCode(code);
    if (!project) redirect('/portal');

    // Adım İlerleme Durumu Hesaplama
    const step =
        project.status === 'WAITING_BRIEF' ? 1 :
            project.status === 'BRIEF_SUBMITTED' ? 2 :
                project.status === 'PRICING_SENT' || project.status === 'NEGOTIATION' ? 3 :
                    project.status === 'APPROVED' ? 4 : 2;

    return (
        <div className="min-h-screen bg-black text-white pb-20">

            {/* HEADER */}
            <header className="bg-gray-900 border-b border-gray-800 py-6 px-4 md:px-8 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
                <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaRocket className="text-blue-500" /> Proje Paneli
                    </h1>
                    <p className="text-gray-400 text-sm">Hoşgeldin, <span className="text-white font-medium">{project.name}</span></p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block bg-blue-600/10 text-blue-400 px-4 py-2 rounded-lg text-sm border border-blue-600/20 font-mono">
                        {project.accessCode}
                    </div>

                    <Link href="/portal" className="text-gray-400 hover:text-red-400 transition p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-red-500/50">
                        <FaSignOutAlt size={18} />
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 mt-8 md:mt-12">

                {/* PROGRESS BAR (AKIŞ ÇUBUĞU) */}
                <div className="mb-12 hidden md:block">
                    <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-800 -z-10"></div>
                        <StepItem step={1} currentStep={step} label="Başvuru" icon={<FaCheckCircle />} />
                        <StepItem step={2} currentStep={step} label="İnceleme & Analiz" icon={<FaSearch />} />
                        <StepItem step={3} currentStep={step} label="Teklif & Sözleşme" icon={<FaMoneyBillWave />} />
                        <StepItem step={4} currentStep={step} label="Geliştirme (Canlı)" icon={<FaRocket />} />
                    </div>
                </div>

                {/* --- ANA İÇERİK YÖNLENDİRMESİ --- */}
                <div className="animate-fadeIn">

                    {/* 1. EKSİK BİLGİ VARSA FORM AÇILIR */}
                    {project.status === 'WAITING_BRIEF' && (
                        // Eğer BriefForm dosyan varsa: <BriefForm project={project} />
                        // Yoksa geçici uyarı:
                        <div className="p-8 bg-gray-900 rounded-2xl text-center border border-gray-800">
                            <h2 className="text-2xl font-bold text-white mb-2">Bilgiler Eksik</h2>
                            <p className="text-gray-400">Lütfen proje detay formunu doldurun.</p>
                        </div>
                    )}

                    {/* 2. İNCELENİYOR */}
                    {project.status === 'BRIEF_SUBMITTED' && (
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradientMove bg-[length:200%_100%]"></div>
                            <div className="w-24 h-24 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20 animate-pulse">
                                <FaSearch size={36} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Projen İnceleniyor 🔍</h2>
                            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                                Başvuru detaylarını aldım. Teknik gereksinimleri analiz edip sana özel fiyat ve süre teklifimi hazırlıyorum.
                            </p>
                            <div className="inline-flex items-center gap-3 px-5 py-3 bg-gray-950 rounded-xl border border-gray-800 text-blue-400 text-sm font-medium shadow-inner">
                                <div className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </div>
                                Durum: Analiz Yapılıyor...
                            </div>
                        </div>
                    )}

                    {/* 3. TEKLİF GELDİ veya PAZARLIK VAR */}
                    {(project.status === 'PRICING_SENT' || project.status === 'NEGOTIATION') && (
                        <ProposalView project={project} />
                    )}

                    {/* 4. ONAYLANDI -> CANLI KONTROL PANELİ (YENİ BİLEŞEN) */}
                    {project.status === 'APPROVED' && (
                        <ProjectStatusView project={project} />
                    )}

                </div>
            </main>
        </div>
    );
}

// Helper: Progress Bar Item
function StepItem({ step, currentStep, label, icon }: any) {
    const isCompleted = currentStep > step;
    const isCurrent = currentStep === step;

    return (
        <div className="flex flex-col items-center gap-2 bg-black px-4 z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500
                ${isCompleted ? 'bg-green-500 border-black text-white' :
                    isCurrent ? 'bg-blue-600 border-black text-white scale-110 shadow-[0_0_20px_rgba(37,99,235,0.5)]' :
                        'bg-gray-800 border-black text-gray-500'}`}>
                {isCompleted ? <FaCheckCircle size={20} /> : icon}
            </div>
            <span className={`text-xs font-bold uppercase transition-colors duration-300 ${isCurrent ? 'text-blue-500' : isCompleted ? 'text-green-500' : 'text-gray-600'}`}>
                {label}
            </span>
        </div>
    );
}