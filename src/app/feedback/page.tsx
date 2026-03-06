"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

const FeedbackPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        rating: '5',
        text: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, name, value } = e.target;
        const fieldName = id ? id.replace('r-', '') : name;
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            await api.addReview({
                name: formData.name,
                role: formData.role,
                email: formData.email,
                text: formData.text,
                rating: parseInt(formData.rating, 10),
                is_featured: false
            });

            setStatus('success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bb-black font-sans">
            <div className="w-full max-w-lg bg-bb-charcoal border border-white/10 p-8 md:p-12 rounded-2xl relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-bb-gold/10 rounded-full blur-[50px]"></div>

                {/* Animated Close Button */}
                <Link href="/" className="line-to-cross absolute top-6 right-6 group">
                    <div className="line line-1"></div>
                    <div className="line line-2"></div>
                </Link>

                <div className="mb-8 text-center pt-4">
                    <Link href="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
                        <img src="/Black Banana.svg" alt="Black Banana" className="h-8" />
                    </Link>
                    <h1 className="text-3xl font-bold uppercase mb-2">Client Feedback</h1>
                    <p className="text-white/40 text-sm font-body">Help us refine our craft.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Your Name</label>
                        <input
                            type="text"
                            id="r-name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-bb-gold outline-none text-white transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Role / Company</label>
                        <input
                            type="text"
                            id="r-role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-bb-gold outline-none text-white transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Email</label>
                        <input
                            type="email"
                            id="r-email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-bb-gold outline-none text-white transition-colors"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Rating</label>
                        <div className="flex gap-4">
                            {['5', '4', '3', '2', '1'].map(value => (
                                <label key={value} className="cursor-pointer flex items-center gap-2 group/radio text-sm font-medium">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={value}
                                        checked={formData.rating === value}
                                        onChange={handleChange}
                                        className="accent-bb-gold w-4 h-4"
                                    />
                                    <span className={formData.rating === value ? 'text-bb-gold' : 'text-white/60 group-hover/radio:text-white transition-colors'}>
                                        {value}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Feedback</label>
                        <textarea
                            id="r-text"
                            rows={3}
                            value={formData.text}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-bb-gold outline-none text-white transition-colors resize-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className={`w-full py-4 font-bold uppercase tracking-widest rounded-lg transition-all ${status === 'success' ? 'bg-green-500 text-white' : 'bg-bb-gold text-black hover:bg-white'}`}
                    >
                        {status === 'idle' && 'Submit Feedback'}
                        {status === 'submitting' && 'Submitting...'}
                        {status === 'success' && 'Success!'}
                        {status === 'error' && 'Error - Try Again'}
                    </button>
                </form>
            </div>

            <style jsx>{`
                /* Ensure local adjustments for the feedback form height and spacing match vanilla version */
                form {
                    max-height: 80vh;
                }
            `}</style>
        </div>
    );
};

export default FeedbackPage;
