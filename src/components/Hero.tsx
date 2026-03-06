"use client";

import React, { useEffect, useRef, useState } from 'react';

const Hero = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // 1. Check local storage for preference, default to false (unmuted)
        const savedPreference = localStorage.getItem('bb_video_muted');
        const shouldMute = savedPreference ? JSON.parse(savedPreference) : false;

        setIsMuted(shouldMute);
        video.muted = shouldMute;

        // 2. Attempt to play
        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                // Autoplay was prevented.
                if (error.name === 'NotAllowedError') {
                    console.log("Browser blocked unmuted autoplay. Falling back to muted.");
                    video.muted = true;
                    setIsMuted(true);
                    // Crucial: Don't save this to localStorage, it was a forced browser action, not user preference.
                    video.play().catch(e => console.error("Muted autoplay also failed:", e));
                }
            });
        }

        // 3. Auto-mute on scroll past 50vh
        const handleScroll = () => {
            if (!videoRef.current) return;

            // If scrolled past 50% of viewport and video is currently playing unmuted
            if (window.scrollY > window.innerHeight * 0.5 && !videoRef.current.muted) {
                videoRef.current.muted = true;
                setIsMuted(true);
                // Optionally save this preference, but doing so might annoy active listeners navigating around.
                // localStorage.setItem('bb_video_muted', 'true'); 
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMute = () => {
        if (videoRef.current) {
            const newMutedState = !videoRef.current.muted;
            videoRef.current.muted = newMutedState;
            setIsMuted(newMutedState);
            localStorage.setItem('bb_video_muted', JSON.stringify(newMutedState));
        }
    };

    return (
        <section className="h-[50vh] md:h-screen w-full relative flex items-center justify-center overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover hidden md:block z-0"
            >
                <source src="/Hero%20Video%20v2.mp4" type="video/mp4" />
            </video>

            {/* Manual Mute Toggle */}
            <button
                onClick={toggleMute}
                className="hidden md:flex absolute bottom-8 right-8 z-30 w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-full items-center justify-center text-white hover:border-[#F59E0B] transition-all hover-trigger"
            >
                {!isMuted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z">
                        </path>
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z">
                        </path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
                    </svg>
                )}
            </button>

            {/* Mobile Hero */}
            <div className="absolute inset-0 w-full h-full bg-[#050505] md:hidden relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]">
                </div>
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F59E0B]/20 rounded-full blur-[80px] animate-pulse-slow">
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <h1
                        className="text-4xl font-bold uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                        Black <span className="text-[#F59E0B]">Banana</span>
                    </h1>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </section>
    );
};

export default Hero;
