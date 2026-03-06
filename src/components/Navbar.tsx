"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.classList.toggle('overflow-hidden');
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.classList.remove('overflow-hidden');
    };

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center w-full px-4 group/nav">
            <div className="w-full max-w-6xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-4 md:px-6 py-3 flex justify-between items-center shadow-[0_0_25px_rgba(245,158,11,0.15)] transition-all duration-500 relative z-50 group-hover/nav:shadow-[0_0_50px_rgba(245,158,11,0.4)] group-hover/nav:border-[#F59E0B]/40">
                <Link href="/" className="block w-24 md:w-32 hover:opacity-80 transition-opacity">
                    <img src="/Black Banana.svg" alt="Black Banana" />
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#work"
                        className="text-sm font-medium text-white/70 hover:text-bb-gold transition-colors uppercase tracking-wider text-[11px]">Work</Link>
                    <Link href="#services"
                        className="text-sm font-medium text-white/70 hover:text-bb-gold transition-colors uppercase tracking-wider text-[11px]">Services</Link>
                    <Link href="#agency"
                        className="text-sm font-medium text-white/70 hover:text-bb-gold transition-colors uppercase tracking-wider text-[11px]">Method</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="#contact"
                        className="hidden md:inline-block px-5 py-2 bg-white/5 border border-white/20 rounded-full hover:bg-bb-gold hover:text-black hover:border-bb-gold transition-all uppercase text-[10px] font-bold tracking-widest hover-trigger">Let's
                        Talk</Link>
                    <button
                        onClick={toggleMenu}
                        className="md:hidden w-10 h-10 flex items-center justify-center text-white/70 hover:text-bb-gold border border-white/10 rounded-full bg-white/5"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div className={`fixed inset-0 bg-black/95 backdrop-blur-2xl z-40 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-400 ease-in-out flex flex-col items-center justify-center space-y-8 md:hidden`}>
                <button
                    onClick={toggleMenu}
                    className="absolute top-8 right-8 text-white/50 hover:text-bb-gold"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <Link href="#work" onClick={closeMenu}
                    className="text-3xl font-bold uppercase tracking-wider hover:text-bb-gold transition-colors">Work</Link>
                <Link href="#services" onClick={closeMenu}
                    className="text-3xl font-bold uppercase tracking-wider hover:text-bb-gold transition-colors">Services</Link>
                <Link href="#agency" onClick={closeMenu}
                    className="text-3xl font-bold uppercase tracking-wider hover:text-bb-gold transition-colors">Agency</Link>
                <Link href="#contact" onClick={closeMenu}
                    className="px-8 py-3 bg-bb-gold text-black font-bold uppercase rounded-full mt-4">Let's Talk</Link>
            </div>
        </nav>
    );
};

export default Navbar;
