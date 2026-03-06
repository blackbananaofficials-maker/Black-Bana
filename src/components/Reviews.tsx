"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Review } from '@/lib/api';

const Reviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const data = await api.getReviews();
            setReviews(data.filter(r => r.is_featured));
        };
        fetchReviews();
    }, []);

    return (
        <section className="py-20 md:py-32 px-6 bg-[#050505] relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase">
                        Client <span className="text-[#F59E0B]">Intel</span>
                    </h2>
                    <Link href="/feedback"
                        className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] hover:underline">
                        Submit Feedback →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className={`bg-white/5 border border-white/5 p-8 rounded-2xl backdrop-blur-sm hover:border-[#F59E0B]/50 transition-colors hover-trigger`}
                        >
                            <div className="text-[#F59E0B] mb-4 text-xl">
                                {"★".repeat(review.rating)}
                            </div>
                            <p className="text-white/70 mb-8 font-body leading-relaxed text-sm">
                                "{review.text}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center font-bold text-white uppercase overflow-hidden">
                                    {review.email ? review.email.charAt(0) : review.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{review.name}</p>
                                    <p className="text-[10px] uppercase text-white/40">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
