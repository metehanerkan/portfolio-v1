'use client';

import { FaBold, FaItalic, FaLink, FaListUl, FaQuoteRight, FaHeading, FaCode, FaImage } from 'react-icons/fa';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    rows?: number;
}

export default function MarkdownEditor({ value, onChange, label = "İçerik", rows = 15 }: MarkdownEditorProps) {

    const insertText = (before: string, after: string = "") => {
        const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>

            <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">

                <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-800 border-b border-gray-700">
                    <ToolbarButton icon={<FaBold />} tooltip="Kalın" onClick={() => insertText('**', '**')} />
                    <ToolbarButton icon={<FaItalic />} tooltip="İtalik" onClick={() => insertText('*', '*')} />
                    <div className="w-px h-6 bg-gray-600 mx-1"></div>
                    <ToolbarButton icon={<FaHeading />} tooltip="Başlık" onClick={() => insertText('## ')} />
                    <ToolbarButton icon={<FaQuoteRight />} tooltip="Alıntı" onClick={() => insertText('> ')} />
                    <div className="w-px h-6 bg-gray-600 mx-1"></div>
                    <ToolbarButton icon={<FaListUl />} tooltip="Liste" onClick={() => insertText('- ')} />
                    <ToolbarButton icon={<FaCode />} tooltip="Kod Bloğu" onClick={() => insertText('```\n', '\n```')} />
                    <div className="w-px h-6 bg-gray-600 mx-1"></div>
                    <ToolbarButton icon={<FaLink />} tooltip="Link Ekle" onClick={() => insertText('[Link Yazısı](', ')')} />
                    <ToolbarButton icon={<FaImage />} tooltip="Resim Ekle" onClick={() => insertText('![Resim Açıklaması](', ')')} />
                </div>

                <textarea
                    id="markdown-textarea"
                    name="content"
                    rows={rows}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-full p-4 bg-gray-900 text-gray-100 placeholder-gray-500 border-none focus:ring-0 resize-y font-mono text-sm"
                    placeholder="Yazınızı buraya Markdown formatında yazın..."
                />
            </div>
            <p className="text-xs text-gray-500 text-right">Markdown desteklenir ✨</p>
        </div>
    );
}

function ToolbarButton({ icon, onClick, tooltip }: { icon: React.ReactNode, onClick: () => void, tooltip: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={tooltip}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
            {icon}
        </button>
    );
}