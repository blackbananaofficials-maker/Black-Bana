"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

const LoginPage = () => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        secret: ''
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error', title: string, message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.email.includes('@')) {
            setStatus({ type: 'error', title: 'Invalid Input', message: 'Please enter a valid email address.' });
            return;
        }
        if (formData.password.length < 6) {
            setStatus({ type: 'error', title: 'Invalid Input', message: 'Password must be at least 6 characters.' });
            return;
        }

        setIsSubmitting(true);

        try {
            // Artificial delay for better UX/feedback visibility
            await new Promise(resolve => setTimeout(resolve, 800));

            if (mode === 'login') {
                await api.login(formData.email, formData.password);
                window.location.href = '/admin';
            } else {
                if (!formData.secret) throw new Error("Admin secret is required");
                await api.register(formData.email, formData.password, formData.secret);
                setStatus({ type: 'success', title: 'Access Granted', message: 'Registration successful! You may now log in.' });
                setMode('login');
            }
        } catch (err: any) {
            setStatus({ type: 'error', title: 'Access Denied', message: err.message || 'Authentication failed.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bb-black font-sans">
            <div className="w-full max-w-md bg-bb-charcoal border border-white/10 p-10 rounded-2xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-bb-gold/10 rounded-full blur-[50px]"></div>

                {/* Back Button */}
                <Link href="/" className="absolute top-6 left-6 md:top-8 md:left-8 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white border border-white/10 hover:border-white/30 rounded-full transition-all flex items-center gap-2 z-50 bg-[#0a0a0a]">
                    <span>← Back</span>
                </Link>

                <div className="text-center mb-8 pt-4">
                    <img src="/Black Banana.svg" alt="Black Banana" className="h-8 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold uppercase mb-2">Restricted Access</h1>
                    <p className="text-white/40 text-sm font-body">System credentials required.</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4 relative z-10">
                    <div className="flex bg-white/5 p-1 rounded mb-6">
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2 text-xs font-bold uppercase rounded transition-all ${mode === 'login' ? 'bg-bb-gold text-black' : 'text-white/40 hover:text-white'}`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('signup')}
                            className={`flex-1 py-2 text-xs font-bold uppercase rounded transition-all ${mode === 'signup' ? 'bg-bb-gold text-black' : 'text-white/40 hover:text-white'}`}
                        >
                            Register
                        </button>
                    </div>

                    {mode === 'signup' && (
                        <div>
                            <input
                                type="text"
                                id="secret"
                                placeholder="Admin Secret Key"
                                value={formData.secret}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded focus:border-bb-gold outline-none text-white transition-colors"
                            />
                        </div>
                    )}

                    <input
                        type="email"
                        id="email"
                        placeholder="Email (admin@blackbanana.com)"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded focus:border-bb-gold outline-none text-white transition-colors"
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded focus:border-bb-gold outline-none text-white transition-colors"
                        required
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-bb-gold text-black font-bold uppercase rounded hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Processing...' : mode === 'login' ? 'Authenticate' : 'Create Account'}
                    </button>
                </form>
            </div>

            {/* Custom Notification Modal */}
            {status && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all">
                    <div className="bg-bb-charcoal border border-white/10 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
                        <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center border ${status.type === 'success' ? 'border-bb-gold/30 bg-bb-gold/10 text-bb-gold' : 'border-red-500/30 bg-red-500/10 text-red-500'}`}>
                            {status.type === 'success' ? (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            ) : (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            )}
                        </div>
                        <h3 className="text-xl font-bold uppercase mb-2">{status.title}</h3>
                        <p className="text-white/60 mb-6 text-sm font-body">{status.message}</p>
                        <button
                            onClick={() => setStatus(null)}
                            className="w-full py-3 bg-bb-gold text-black font-bold uppercase rounded hover:bg-white transition-colors"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
