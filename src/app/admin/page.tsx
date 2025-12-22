import { addProject } from "./actions";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-2xl mx-auto border border-gray-800 rounded-xl p-8 bg-gray-900/50">
                <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Yeni Proje Ekle
                </h1>

                {/* Form server action'ı çağırır */}
                <form action={addProject} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Proje Başlığı</label>
                        <input name="title" required placeholder="Örn: Spotify Clone" className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Açıklama</label>
                        <textarea name="description" required rows={3} placeholder="Projenin detayları..." className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Kategori</label>
                            <select name="category" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white">
                                <option value="Web App">Web App</option>
                                <option value="Mobile App">Mobile App</option>
                                <option value="Design">Design</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Resim Linki</label>
                            <input name="imageUrl" required placeholder="/projects/resim.png" className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Teknolojiler (Virgülle ayır)</label>
                        <input name="technologies" required placeholder="React, Tailwind, Prisma" className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">GitHub Linki</label>
                        <input name="githubUrl" placeholder="https://github.com/..." className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none" />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition transform hover:scale-[1.02]">
                        🚀 Projeyi Yayınla
                    </button>
                </form>
            </div>
        </div>
    );
}