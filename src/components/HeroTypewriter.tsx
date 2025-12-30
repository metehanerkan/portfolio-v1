'use client';

import Typewriter from 'typewriter-effect';

export default function HeroTypewriter() {
    return (
        <div className="text-xl md:text-2xl text-gray-300 mb-8 font-mono h-8 flex items-center gap-2">
            <span className="text-purple-400 font-bold">Is</span>
            <div className="inline-block">
                <Typewriter
                    options={{
                        strings: [
                            'a Full Stack Developer.',
                            'a React & Next.js Enthusiast.',
                            'building modern web apps.',
                            'a Problem Solver.'
                        ],
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