'use client';

import Typewriter from 'typewriter-effect';

export default function HeroTypewriter({ words }: { words: string[] }) {
    return (
        <div className="text-xl md:text-2xl text-purple-700 dark:text-gray-300 mb-8 font-mono h-8 flex items-center gap-2">
            <div className="inline-block">
                <Typewriter
                    options={{
                        strings: words,
                        autoStart: true,
                        loop: true,
                        deleteSpeed: 50,
                        delay: 75,
                    }}
                />
            </div>
        </div>
    );
}