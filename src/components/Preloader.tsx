"use client";

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

const Preloader = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    setIsVisible(false);
                    document.body.classList.remove('overflow-hidden');
                }
            });

            tl.to("#preloader", {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut"
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div id="preloader" className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center">
            <div className="loader-b text-[#F59E0B] text-8xl font-bold animate-pulse">B</div>
            <div className="loader-line w-40 h-[2px] bg-white/5 mt-8 relative overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 h-full bg-[#F59E0B] w-full -translate-x-full animate-loading-bar"></div>
            </div>
            <style jsx>{`
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-loading-bar {
                    animation: loading-bar 2s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Preloader;
