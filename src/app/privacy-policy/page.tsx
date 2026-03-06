import React from 'react';

export const metadata = {
    title: 'Privacy Policy | Black Banana',
    description: 'Privacy Policy for Black Banana, a brand operated under Edverbin Pvt. Ltd.',
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-16 container mx-auto">
            <div className="max-w-4xl mx-auto space-y-8 font-body">

                <div className="border-b border-white/10 pb-8 mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4 text-white">Privacy Policy</h1>
                    <p className="text-lg text-white/60 mb-2">Black Banana (A Division of Edverbin Pvt. Ltd.)</p>
                    <p className="text-sm text-[#F59E0B]">Last Updated: 7 March 2026</p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-white/80 space-y-8">
                    <p className="lead text-xl text-white">
                        Black Banana, a brand operated under Edverbin Pvt. Ltd., respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">1. Information We Collect</h2>
                        <p className="mb-4">We may collect the following information:</p>

                        <h3 className="text-xl text-white mt-4 mb-2">Personal Information</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Business information</li>
                            <li>Billing details</li>
                        </ul>

                        <h3 className="text-xl text-white mt-4 mb-2">Technical Information</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                            <li>IP address</li>
                            <li>Browser type</li>
                            <li>Device information</li>
                            <li>Website usage data</li>
                            <li>Cookies and tracking data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">2. How We Use Your Information</h2>
                        <p className="mb-4">We use the collected information to:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Provide digital marketing services</li>
                            <li>Respond to inquiries and customer support requests</li>
                            <li>Improve website performance</li>
                            <li>Process payments and service agreements</li>
                            <li>Send updates, newsletters, or marketing communication</li>
                            <li>Maintain security and prevent fraud</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">3. Sharing of Information</h2>
                        <p className="mb-4">Black Banana does not sell or rent personal data.</p>
                        <p className="mb-4">Information may be shared with:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Payment processing providers</li>
                            <li>Technology and hosting providers</li>
                            <li>Legal authorities when required by law</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">4. Data Security</h2>
                        <p className="mb-4">We implement appropriate technical and organizational measures to protect personal data from unauthorized access, misuse, or disclosure.</p>
                        <p className="mb-4">However, no online transmission is completely secure.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">5. Cookies</h2>
                        <p className="mb-4">Our website may use cookies and similar technologies to improve user experience and analyze website traffic.</p>
                        <p className="mb-4">Users can disable cookies through browser settings.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">6. Third-Party Services</h2>
                        <p className="mb-4">Our services may integrate with third-party platforms including:</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                            <li>Meta (Facebook & Instagram Ads)</li>
                            <li>Google Ads</li>
                            <li>Shopify</li>
                            <li>Amazon Seller Central</li>
                            <li>Analytics tools</li>
                        </ul>
                        <p className="mb-4">These platforms operate under their own privacy policies.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">7. Your Rights</h2>
                        <p className="mb-4">Users may request to:</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                            <li>Access their personal data</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion of data</li>
                        </ul>
                        <p className="mb-4">Requests can be made via email.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">8. Policy Updates</h2>
                        <p className="mb-4">We may update this Privacy Policy periodically. Changes will be posted on this page.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">9. Contact Information</h2>
                        <p className="mb-4">For privacy-related concerns contact:</p>
                        <address className="not-italic bg-white/5 p-6 rounded-lg border border-white/10">
                            <strong className="text-white block mb-1">Black Banana</strong>
                            <span className="block mb-2">A Division of Edverbin Pvt. Ltd.</span>
                            <span className="block">Email: <a href="mailto:blackbanana.officials@gmail.com" className="text-[#F59E0B] hover:text-white transition-colors">blackbanana.officials@gmail.com</a></span>
                        </address>
                    </section>

                </div>
            </div>
        </div>
    );
}
