"use client";

import React, { useState, useEffect } from 'react';

const GlobalLoader = () => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Expose a global way to trigger the loader
        (window as any).setGlobalLoading = (loading: boolean) => {
            setIsLoading(loading);
        };

        return () => {
            delete (window as any).setGlobalLoading;
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[10000]">
            <div className="h-full bg-[#F59E0B] animate-loading-bar-fast shadow-[0_0_10px_#F59E0B]"></div>
            <style jsx>{`
                @keyframes loading-bar-fast {
                    0% { transform: translateX(-100%); width: 0%; }
                    50% { transform: translateX(0%); width: 100%; }
                    100% { transform: translateX(100%); width: 0%; }
                }
                .animate-loading-bar-fast {
                    animation: loading-bar-fast 1s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default GlobalLoader;
