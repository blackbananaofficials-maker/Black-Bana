"use client";

import React, { useState } from 'react';
import { api } from '@/lib/api';

const ContactForm = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        company: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            await api.submitContact(formData);
            setStatus('sent');
            setFormData({ name: '', phone: '', email: '', company: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id.replace('c-', '')]: e.target.value }));
    };

    return (
        <section id="contact" className="bg-[#080808] border-t border-white/10 pt-20 pb-12 px-6 md:px-16">
            <div className="flex flex-col md:flex-row gap-16 mb-20 md:mb-32">
                <div className="md:w-1/2">
                    <h2 className="text-[14vw] md:text-[7vw] font-bold uppercase leading-none mb-8">
                        Let's<br />Build
                    </h2>
                    <p className="text-white/50 text-base md:text-lg font-body max-w-md">
                        Don't settle for average. Partner with us and redefine your category.
                    </p>
                    <div className="mt-12 space-y-2 font-body text-white/70">
                        <a href="mailto:blackbanana.officials@gmail.com" className="hover:text-[#F59E0B] transition-colors cursor-pointer hover-trigger block">
                            blackbanana.officials@gmail.com
                        </a>
                    </div>
                </div>
                <div className="md:w-1/2">
                    <form className="space-y-6" id="contactForm" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                id="c-name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 p-4 rounded-lg focus:border-[#F59E0B] outline-none text-white hover-trigger w-full"
                                required
                            />
                            <input
                                type="tel"
                                id="c-phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 p-4 rounded-lg focus:border-[#F59E0B] outline-none text-white hover-trigger w-full"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="email"
                                id="c-email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 p-4 rounded-lg focus:border-[#F59E0B] outline-none text-white hover-trigger w-full"
                                required
                            />
                            <input
                                type="text"
                                id="c-company"
                                placeholder="Company / Brand"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-[#F59E0B] outline-none text-white hover-trigger"
                            />
                        </div>
                        <textarea
                            id="c-message"
                            rows={4}
                            placeholder="Tell us about the project..."
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-[#F59E0B] outline-none text-white hover-trigger"
                            required
                        ></textarea>
                        <button
                            type="submit"
                            id="c-submit"
                            disabled={status === 'sending'}
                            className={`px-8 py-4 bg-[#F59E0B] text-black font-bold uppercase tracking-widest rounded-lg transition-all w-full hover-trigger ${status === 'sending' ? 'opacity-50' : 'hover:bg-white'}`}
                        >
                            {status === 'idle' && 'Launch Project'}
                            {status === 'sending' && 'SENDING...'}
                            {status === 'sent' && 'MESSAGE SENT'}
                            {status === 'error' && 'ERROR - TRY AGAIN'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
