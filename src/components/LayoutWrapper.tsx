"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isStandalonePage = pathname?.startsWith('/login') || pathname?.startsWith('/feedback') || pathname?.startsWith('/admin');

    return (
        <>
            {!isStandalonePage && <Navbar />}
            <main>{children}</main>
            {!isStandalonePage && <Footer />}
        </>
    );
}
