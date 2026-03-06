"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface TickerProps {
    items?: string[];
}

const InfiniteTicker = ({ items }: TickerProps) => {
    const [companies, setCompanies] = useState<string[]>([]);

    useEffect(() => {
        if (!items) {
            const fetchCompanies = async () => {
                const data = await api.getCompanies();
                setCompanies(data);
            };
            fetchCompanies();
        }
    }, [items]);

    const displayItems = items || companies;

    return (
        <section className="py-5 bg-[#050505] border-y border-white/10 overflow-hidden relative z-20 group/ticker">
            <div className="relative w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 md:[&_li]:mx-12 [&_img]:max-w-none animate-infinite-scroll group-hover/ticker:[animation-play-state:paused]">
                    {displayItems.length > 0 ? displayItems.map((item, idx) => (
                        <li
                            key={idx}
                            className={`text-2xl md:text-4xl font-bold uppercase transition-all duration-300 cursor-pointer active:scale-110 hover:scale-110 active:text-[#F59E0B] hover:text-[#F59E0B] active:drop-shadow-[0_0_25px_rgba(245,158,11,0.8)] hover:drop-shadow-[0_0_25px_rgba(245,158,11,0.8)] ${idx % 2 === 0 ? 'text-transparent' : 'text-white'}`}
                            style={idx % 2 === 0 ? { WebkitTextStroke: '1px white' } : {}}
                        >
                            {item}
                        </li>
                    )) : (
                        <li className="text-white/20 uppercase font-bold text-xl">Loading Partnerships...</li>
                    )}
                </ul>
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 md:[&_li]:mx-12 [&_img]:max-w-none animate-infinite-scroll group-hover/ticker:[animation-play-state:paused]" aria-hidden="true">
                    {displayItems.map((item, idx) => (
                        <li
                            key={`clone-${idx}`}
                            className={`text-2xl md:text-4xl font-bold uppercase transition-all duration-300 cursor-pointer active:scale-110 hover:scale-110 active:text-[#F59E0B] hover:text-[#F59E0B] active:drop-shadow-[0_0_25px_rgba(245,158,11,0.8)] hover:drop-shadow-[0_0_25px_rgba(245,158,11,0.8)] ${idx % 2 === 0 ? 'text-transparent' : 'text-white'}`}
                            style={idx % 2 === 0 ? { WebkitTextStroke: '1px white' } : {}}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <style jsx global>{`
                @keyframes infinite-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-100%); }
                }
                .animate-infinite-scroll {
                    animation: infinite-scroll 25s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default InfiniteTicker;
