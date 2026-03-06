"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Expertise as ExpertiseType } from '@/lib/api';

const Expertise = () => {
    const [expertise, setExpertise] = useState<ExpertiseType[]>([]);

    useEffect(() => {
        const fetchExpertise = async () => {
            const data = await api.getExpertise();
            setExpertise(data);
        };
        fetchExpertise();
    }, []);

    return (
        <section id="services" className="py-20 md:py-32 px-6 md:px-16 bg-[#050505]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20">
                <h2 className="text-[12vw] md:text-[6vw] font-bold uppercase leading-none mb-6 md:mb-0">
                    Our<br />Expertise
                </h2>
                <div className="md:text-right">
                    <p className="text-[#F59E0B] text-xs uppercase tracking-widest mb-2">Full Service</p>
                    <p className="text-white/40 max-w-sm font-body text-sm">
                        Everything you need to dominate the digital landscape, under one roof.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {expertise.slice(0, 3).map((item, idx) => (
                    <div
                        key={idx}
                        className="service-card group bg-[#0A0A0A] hover-trigger border border-white/5 hover:border-[#F59E0B]/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#F59E0B]/5 rounded-full blur-3xl group-hover:bg-[#F59E0B]/10 transition-colors"></div>

                        <div
                            className="relative z-10 transform group-hover:scale-110 transition-transform duration-500 mb-6"
                            dangerouslySetInnerHTML={{ __html: item.icon || '' }}
                        ></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold uppercase mb-4 text-white">{item.title}</h3>
                            <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">{item.desc}</p>
                        </div>

                        <div className="absolute top-4 right-6 text-5xl md:text-6xl font-bold text-white/5 group-hover:text-[#F59E0B]/10 transition-colors z-0 select-none">
                            {item.code}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link href="/services"
                    className="inline-block px-8 py-4 border border-white/10 rounded-full hover:bg-[#F59E0B] hover:text-black hover:border-[#F59E0B] transition-all uppercase text-sm font-bold tracking-widest hover-trigger">
                    View All Services
                </Link>
            </div>
        </section>
    );
};

export default Expertise;
