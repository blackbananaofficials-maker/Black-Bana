import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-black pt-20 pb-12 px-6 md:px-16 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 md:mb-24">
                <div className="col-span-1 md:col-span-2">
                    <h3 className="text-2xl font-bold uppercase mb-6">Black Banana</h3>
                    <p className="text-white/40 font-body max-w-sm mb-8 text-sm">
                        We are a digital-first agency obsessed with performance, aesthetics, and code.
                        We don't just build websites; we build digital empires.
                    </p>
                    <div className="flex gap-4">
                        <Link href="https://www.instagram.com/blackbanana.in?igsh=NHE4a3dxczg2OTRm" target="_blank" rel="noopener noreferrer"
                            className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">IG</Link>
                        <Link href="https://www.linkedin.com/company/black-banana/" target="_blank" rel="noopener noreferrer"
                            className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">LN</Link>
                    </div>
                </div>
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-[#F59E0B] mb-6">Sitemap</h4>
                    <ul className="space-y-4 text-white/60 font-body text-sm">
                        <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link href="#work" className="hover:text-white transition-colors">Work</Link></li>
                        <li><Link href="#services" className="hover:text-white transition-colors">Services</Link></li>
                        <li><Link href="#agency" className="hover:text-white transition-colors">Method</Link></li>
                        <li><Link href="/admin" className="hover:text-[#F59E0B] transition-colors">Admin Panel</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-[#F59E0B] mb-6">Legal</h4>
                    <ul className="space-y-4 text-white/60 font-body text-sm">
                        <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
