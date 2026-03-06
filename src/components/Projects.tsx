"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { api, Project } from '@/lib/api';

/**
 * ProjectCard — Zoom-reveal effect for image masterpieces.
 *
 * IMAGE CARDS:
 *  Default  → Image zoomed in (~1.75×) anchored to the top-right corner,
 *             so the featured stat/content is highlighted. 60% brightness.
 *  Hover    → GSAP smoothly zooms out to scale(1) + full brightness,
 *             revealing the complete image. Badge pops. Title slides up.
 *
 * VIDEO CARDS — unchanged play/pause + brightness behaviour.
 */

type CardDims = { width: number; height: number } | null;

const ProjectCard = ({ project }: { project: Project }) => {
    const isImage = String(project.isVideo) === 'false';

    const imgRef = useRef<HTMLImageElement>(null);
    const badgeRef = useRef<HTMLSpanElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState<CardDims>(null);

    /* ── Detect image natural dimensions → size card at 40% ── */
    useEffect(() => {
        if (!isImage || !project.media) return;
        const probe = new window.Image();
        probe.onload = () => {
            setDims({
                width: Math.round(probe.naturalWidth * 0.4),
                height: Math.round(probe.naturalHeight * 0.4),
            });
        };
        probe.src = project.media;
    }, [isImage, project.media]);

    /* ── Initialise image state once dims are ready ── */
    useEffect(() => {
        if (!isImage || !dims) return;
        // Zoom in to top-right corner, dim slightly
        gsap.set(imgRef.current, {
            scale: 1.75,
            transformOrigin: 'top right',
            filter: 'brightness(0.55)',
        });
        gsap.set(titleRef.current, { y: 14, opacity: 0 });
        gsap.set(badgeRef.current, { y: 5, opacity: 0.65, scale: 0.9 });
    }, [isImage, dims]);

    /* ── Hover in — zoom out, reveal full image ── */
    const onEnter = () => {
        if (!isImage) return;
        gsap.to(imgRef.current, {
            scale: 1,
            filter: 'brightness(1)',
            duration: 0.65,
            ease: 'power2.out',
        });
        gsap.to(overlayRef.current, { opacity: 0.4, duration: 0.45 });
        gsap.to(badgeRef.current, { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.7)' });
        gsap.to(titleRef.current, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', delay: 0.07 });
    };

    /* ── Hover out — zoom back in to corner ── */
    const onLeave = () => {
        if (!isImage) return;
        gsap.to(imgRef.current, {
            scale: 1.75,
            filter: 'brightness(0.55)',
            duration: 0.55,
            ease: 'power2.inOut',
        });
        gsap.to(overlayRef.current, { opacity: 0.9, duration: 0.4 });
        gsap.to(badgeRef.current, { y: 5, opacity: 0.65, scale: 0.9, duration: 0.25 });
        gsap.to(titleRef.current, { y: 14, opacity: 0, duration: 0.3, ease: 'power2.in' });
    };

    const cardStyle: React.CSSProperties = dims
        ? { width: dims.width, height: dims.height, flexShrink: 0 }
        : {};

    return (
        <div
            className={`relative rounded-2xl overflow-hidden snap-center work-card bg-black cursor-pointer
                ${!dims ? 'min-w-[80vw] md:min-w-[350px] h-[500px] md:h-[550px]' : ''}`}
            data-category={project.type}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            style={{
                ...cardStyle,
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'border-color 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
        >
            {/* ── Media ── */}
            {!isImage ? (
                <video
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ filter: 'brightness(0.55)', transition: 'filter 0.4s' }}
                    autoPlay muted loop playsInline
                    onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.play(); }}
                    onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(0.55)'; e.currentTarget.pause(); }}
                >
                    <source
                        src={project.videoUrl || project.media ||
                            'https://assets.mixkit.co/videos/preview/mixkit-fashion-show-in-slow-motion-34444-large.mp4'}
                        type="video/mp4"
                    />
                </video>
            ) : (
                /*
                 * object-fit: cover fills the card entirely.
                 * GSAP scale + transformOrigin control the zoom area.
                 */
                <img
                    ref={imgRef}
                    src={project.media!}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ willChange: 'transform, filter' }}
                />
            )}

            {/* ── Gradient overlay ── */}
            <div
                ref={isImage ? overlayRef : undefined}
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
                    opacity: isImage ? 0.9 : 0.8,
                }}
            />

            {/* ── Badge + Title ── */}
            <div className="absolute bottom-5 left-5 z-20 pointer-events-none">
                <span
                    ref={isImage ? badgeRef : undefined}
                    className="px-3 py-1 bg-[#F59E0B] text-black text-[10px] font-bold uppercase tracking-widest rounded-full mb-2 inline-block"
                >
                    {project.type}
                </span>
                <h3
                    ref={isImage ? titleRef : undefined}
                    className="text-xl md:text-2xl font-bold uppercase text-white leading-tight"
                >
                    {project.title}
                </h3>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════ */

const Projects = () => {
    const [filter, setFilter] = useState('all');
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => { api.getProjects().then(setProjects); }, []);

    const handleFilter = (cat: string) => {
        setFilter(cat);
        containerRef.current?.querySelectorAll('.work-card').forEach(el => {
            const c = el.getAttribute('data-category');
            if (cat === 'all' || cat === c?.toLowerCase()) {
                gsap.fromTo(el, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4 });
            }
        });
    };

    const scroll = (dir: 'left' | 'right') =>
        scrollContainerRef.current?.scrollBy({ left: dir === 'right' ? 450 : -450, behavior: 'smooth' });

    const categories = [
        { id: 'all', label: 'All Work' },
        { id: 'ugc', label: 'UGC Video' },
        { id: 'production', label: 'Production' },
        { id: 'branding', label: 'Branding' },
        { id: 'cgi', label: 'CGI' },
    ];

    const filtered = projects.filter(p => filter === 'all' || p.type?.toLowerCase() === filter);

    return (
        <section id="work" className="py-20 md:py-32 bg-[#050505] relative border-b border-white/5" ref={containerRef}>
            <div className="text-center mb-12 px-4">
                <h2 className="text-[10vw] md:text-5xl font-bold uppercase mb-4">
                    Our <span className="text-[#F59E0B]">Masterpieces</span>
                </h2>
                <p className="text-white/40 text-sm font-body">Filter by category to see what we're capable of.</p>
            </div>

            {/* Filter pills */}
            <div className="container mx-auto px-4 mb-12">
                <div className="flex justify-start md:justify-center overflow-x-auto no-scrollbar pb-4">
                    <div className="flex flex-nowrap gap-3 md:gap-4 px-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`cyber-pill px-6 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider hover-trigger flex-shrink-0 transition-all ${filter === cat.id ? 'active' : ''}`}
                                onClick={() => handleFilter(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll carousel */}
            <div className="relative w-full max-w-[1600px] mx-auto px-0 md:px-12 group">
                <button onClick={() => scroll('left')}
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 border border-white/10 bg-black/50 backdrop-blur-md rounded-full items-center justify-center cursor-pointer hover:border-[#F59E0B] transition-all">
                    <div className="line-to-arrow rotate-180">
                        <div className="main-line" /><div className="arrow-head head-top" /><div className="arrow-head head-bottom" />
                    </div>
                </button>
                <button onClick={() => scroll('right')}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 border border-white/10 bg-black/50 backdrop-blur-md rounded-full items-center justify-center cursor-pointer hover:border-[#F59E0B] transition-all">
                    <div className="line-to-arrow">
                        <div className="main-line" /><div className="arrow-head head-top" /><div className="arrow-head head-bottom" />
                    </div>
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex items-center gap-4 md:gap-6 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar scroll-smooth pl-4 md:pl-0"
                >
                    {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
                </div>
            </div>
        </section>
    );
};

export default Projects;
