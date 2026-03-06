"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.2,
                ease: "power2.out"
            });
        };

        const onMouseEnterLink = () => {
            gsap.to(cursor, {
                scale: 2,
                backgroundColor: "rgba(245, 158, 11, 0.4)",
                duration: 0.3
            });
        };

        const onMouseLeaveLink = () => {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: "transparent",
                duration: 0.3
            });
        };

        window.addEventListener('mousemove', onMouseMove);

        const links = document.querySelectorAll('a, button, .hover-trigger, .cyber-pill');
        links.forEach(link => {
            link.addEventListener('mouseenter', onMouseEnterLink);
            link.addEventListener('mouseleave', onMouseLeaveLink);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            links.forEach(link => {
                link.removeEventListener('mouseenter', onMouseEnterLink);
                link.removeEventListener('mouseleave', onMouseLeaveLink);
            });
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                id="cursor"
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[100] border border-[#F59E0B] rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block"
            />
            <style jsx global>{`
                @media (min-width: 768px) {
                    body { cursor: none !important; }
                    a, button, .hover-trigger, .cyber-pill { cursor: none !important; }
                }
            `}</style>
        </>
    );
};

export default CustomCursor;
