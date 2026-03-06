"use client";

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { api, MethodStep } from '@/lib/api';

const iconMap: Record<string, React.ReactNode> = {
    "01": (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
    ),
    "02": (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15l8.5-7.5L12 3m0 12L3.5 7.5 12 3m0 12v6"></path>
        </svg>
    ),
    "03": (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
    ),
    "04": (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
        </svg>
    ),
    "05": (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
    )
};

const Method = () => {
    const [steps, setSteps] = useState<MethodStep[]>([]);

    useEffect(() => {
        const fetchMethods = async () => {
            const data = await api.getMethods();
            setSteps(data);
        };
        fetchMethods();

        gsap.registerPlugin(ScrollTrigger);

        // --- SPOTLIGHT EFFECT LOGIC ---
        const agencyGrid = document.getElementById('agencyGrid');
        if (agencyGrid) {
            const onMouseMove = (e: MouseEvent) => {
                const cards = document.querySelectorAll('.reactor-card');
                cards.forEach((card) => {
                    const rect = (card as HTMLElement).getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
                    (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
                });
            };

            agencyGrid.addEventListener('mousemove', onMouseMove);
            return () => agencyGrid.removeEventListener('mousemove', onMouseMove);
        }

        // --- GSAP ANIMATIONS ---
        gsap.from("#agencyGrid .reactor-card", {
            scrollTrigger: { trigger: "#agency", start: "top 80%" },
            y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power2.out"
        });
    }, []);

    return (
        <section id="agency" className="relative py-20 px-4 md:px-12 md:py-32 bg-[#050505]">
            <div className="container relative mx-auto z-10">
                <div className="mb-16 md:mb-20 md:text-center">
                    <h2 className="text-[14vw] md:text-[6vw] font-bold uppercase leading-none text-white opacity-90 tracking-tighter">
                        THE <span className="text-[#F59E0B]">METHOD</span>
                    </h2>
                    <p className="max-w-lg mx-auto mt-4 text-sm text-white/60 md:text-base font-body">
                        A calculated process designed to extract maximum value and eliminate guesswork.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 agency-grid" id="agencyGrid">
                    {steps.map((step, idx) => (
                        <div key={step.id || idx} className="reactor-card min-h-[450px]">
                            <div className="reactor-content">
                                <span className="big-number">{step.num}</span>
                                <div className="relative z-20 flex items-start justify-between mb-8">
                                    <div className="flex items-center justify-center w-12 h-12 text-white border rounded-full border-white/10 bg-white/5 icon-box">
                                        {iconMap[step.num] || (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <div className="relative z-20">
                                    <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl uppercase">{step.title}</h3>
                                    <p className="mb-4 text-xs italic text-white/40 font-body italic">{step.subtitle}</p>
                                    <ul className="mb-6 space-y-2 text-sm text-white/70 font-body">
                                        {step.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-[#F59E0B]">•</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-xs font-bold tracking-wider uppercase text-[#F59E0B]/80">{step.footer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Hero Statement */}
                <div className="text-center">
                    <div className="inline-block p-[2px] rounded-full bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent opacity-50 mb-8 w-full max-w-2xl mx-auto h-[1px]"></div>
                    <p className="text-2xl md:text-4xl font-bold uppercase text-white/90 italic tracking-tighter leading-tight max-w-4xl mx-auto">
                        If you’re not ready to <span className="text-[#F59E0B]">scale aggressively</span>, <br className="hidden md:block" /> we’re not your agency.
                    </p>
                </div>
            </div>

            <style jsx>{`
                #agency {
                    background: radial-gradient(circle at 50% 0%, #1a1205 0%, #050505 80%);
                }
                .reactor-card::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(800px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(245, 158, 11, 0.08), transparent 40%);
                    z-index: 1;
                    opacity: 0;
                    transition: opacity 0.5s;
                    pointer-events: none;
                }
                .agency-grid:hover .reactor-card::before {
                    opacity: 1;
                }
                .reactor-content {
                    position: relative;
                    z-index: 10;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 1.5rem 2rem;
                }
                .big-number {
                    font-family: 'Space Grotesk', sans-serif;
                    color: rgba(255, 255, 255, 0.05);
                    font-size: 100px;
                    line-height: 0.8;
                    font-weight: 700;
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    z-index: 0;
                    transition: all 0.5s ease;
                    pointer-events: none;
                }
                @media (min-width: 768px) {
                    .big-number { font-size: 140px; }
                }
                .reactor-card:hover .big-number {
                    color: rgba(245, 158, 11, 0.15);
                    transform: scale(1.05) translateX(-5px);
                }
            `}</style>
        </section>
    );
};

export default Method;
