"use client";

import React, { useEffect, useState } from 'react';
import { api, Expertise as ExpertiseItem } from '@/lib/api';

const ServicesPage = () => {
    const [expertise, setExpertise] = useState<ExpertiseItem[]>([]);

    useEffect(() => {
        const fetchExpertise = async () => {
            const data = await api.getExpertise();
            setExpertise(data);
        };
        fetchExpertise();
    }, []);

    return (
        <main className="pt-32 pb-24 bg-bb-black font-sans min-h-screen">
            <div className="container mx-auto px-6 mb-24 text-center">
                <h1 className="text-[8vw] md:text-6xl font-bold uppercase leading-none mb-6">Our <span className="text-bb-gold">Services</span></h1>
                <p className="text-white/40 max-w-2xl mx-auto font-body text-lg">Comprehensive digital solutions engineered for growth, visibility, and dominance. (Next.js Version)</p>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {expertise.map((e) => (
                        <div key={e.id} className="service-card group bg-[#0A0A0A] border border-white/5 hover:border-bb-gold/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden rounded-xl min-h-[400px]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-bb-gold/5 rounded-full blur-3xl group-hover:bg-bb-gold/10 transition-colors"></div>

                            <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500 mb-6" dangerouslySetInnerHTML={{ __html: e.icon || '' }}></div>

                            <div className="relative z-10">
                                <div className="text-bb-gold text-xs font-bold uppercase tracking-widest mb-2">{e.title.split(' ')[0]}</div>
                                <h3 className="text-2xl md:text-3xl font-bold uppercase mb-4 text-white">{e.title}</h3>
                                <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed font-body">{e.desc}</p>
                            </div>
                            <div className="absolute top-4 right-6 text-5xl md:text-6xl font-bold text-white/5 group-hover:text-bb-gold/10 transition-colors z-0 select-none">{e.code}</div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ServicesPage;
