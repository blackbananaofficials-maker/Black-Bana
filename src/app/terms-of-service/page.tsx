import React from 'react';

export const metadata = {
    title: 'Terms of Service | Black Banana',
    description: 'Terms of Service for Black Banana, a brand operated under Edverbin Pvt. Ltd.',
};

export default function TermsOfService() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-16 container mx-auto">
            <div className="max-w-4xl mx-auto space-y-8 font-body">

                <div className="border-b border-white/10 pb-8 mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4 text-white">Terms of Service</h1>
                    <p className="text-lg text-white/60 mb-2">Black Banana (A Division of Edverbin Pvt. Ltd.)</p>
                    <p className="text-sm text-[#F59E0B]">Last Updated: 7 March 2026</p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-white/80 space-y-8">
                    <p className="lead text-xl text-white">
                        These Terms of Service govern the use of services provided by Black Banana, a brand operated under Edverbin Pvt. Ltd. By using our services, you agree to the following terms.
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">1. Services</h2>
                        <p className="mb-4">Black Banana provides digital marketing and technology services including:</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                            <li>Social Media Marketing</li>
                            <li>Social Media Management</li>
                            <li>Search Engine Optimization (SEO)</li>
                            <li>Website Development</li>
                            <li>Meta Ads Management</li>
                            <li>Google Ads Management</li>
                            <li>Branding &amp; Strategy</li>
                            <li>Shopify Store Setup</li>
                            <li>E-commerce Development</li>
                            <li>Amazon Seller Account Setup and Management</li>
                        </ul>
                        <p className="mb-4">Service scope may vary depending on the contract or proposal agreed with the client.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">2. Client Responsibilities</h2>
                        <p className="mb-4">Clients agree to:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Provide accurate business information</li>
                            <li>Provide necessary access to digital platforms when required</li>
                            <li>Approve marketing materials in a timely manner</li>
                            <li>Ensure compliance with advertising policies of platforms like Meta and Google</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">3. Payments</h2>
                        <p className="mb-4">All services are provided based on agreed pricing.</p>
                        <p className="mb-4">Payments may be:</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                            <li>One-time project payments</li>
                            <li>Monthly retainers</li>
                            <li>Performance-based contracts</li>
                        </ul>
                        <p className="mb-4 text-[#F59E0B]">Failure to complete payments may result in service suspension.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">4. Intellectual Property</h2>
                        <p className="mb-4">All content, strategies, and marketing materials created by Black Banana remain the property of the client after full payment unless otherwise stated in the agreement.</p>
                        <p className="mb-4">Black Banana may use project results for portfolio or marketing purposes unless restricted by a written agreement.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">5. Performance Disclaimer</h2>
                        <p className="mb-4">Digital marketing performance depends on multiple external factors including:</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                            <li>Market conditions</li>
                            <li>Advertising platforms</li>
                            <li>Competitor activity</li>
                            <li>Search engine algorithms</li>
                        </ul>
                        <div className="bg-white/5 p-4 rounded-lg border-l-4 border-[#F59E0B] mt-4 mb-4">
                            <p className="m-0 text-white">Black Banana does not guarantee specific results such as rankings, leads, or revenue.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">6. Termination</h2>
                        <p className="mb-4">Either party may terminate services with written notice as defined in the service agreement.</p>
                        <p className="mb-4 font-bold">Outstanding payments must be cleared before termination.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">7. Limitation of Liability</h2>
                        <p className="mb-4">Black Banana and Edverbin Pvt. Ltd. shall not be liable for:</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                            <li>Indirect or consequential losses</li>
                            <li>Platform account suspensions by third-party services</li>
                            <li>Business losses due to marketing performance fluctuations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">8. Governing Law</h2>
                        <p className="mb-4">These terms are governed by the laws of India.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-8">9. Contact</h2>
                        <p className="mb-4">For service or legal inquiries contact:</p>
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
