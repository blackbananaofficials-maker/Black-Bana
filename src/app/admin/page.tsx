"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, Project, Review, Expertise, MethodStep } from '@/lib/api';

const AdminPage = () => {
    const [stats, setStats] = useState({ projects: 0, reviews: 0, expertise: 0, companies: 0, methods: 0 });
    const [projects, setProjects] = useState<Project[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [expertise, setExpertise] = useState<Expertise[]>([]);
    const [companies, setCompanies] = useState<string[]>([]);
    const [methods, setMethods] = useState<MethodStep[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'project' | 'expertise' | 'company' | 'method'>('project');
    const [toasts, setToasts] = useState<{ id: number, msg: string, type: 'success' | 'deleted' | 'error' }[]>([]);

    // Form States
    const [formData, setFormData] = useState({
        title: '',
        type: 'UGC',
        media: '',
        desc: '',
        code: '',
        companyName: '',
        subtitle: '',
        items: '',
        footer: '',
        num: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const [projData, revData, expData, compData, methData] = await Promise.all([
                api.getProjects(),
                api.getReviews(),
                api.getExpertise(),
                api.getCompanies(),
                api.getMethods()
            ]);
            setProjects(projData);
            setReviews(revData);
            setExpertise(expData);
            setCompanies(compData);
            setMethods(methData);
            setStats({
                projects: projData.length,
                reviews: revData.length,
                expertise: expData.length,
                companies: compData.length,
                methods: methData.length
            });
        };
        loadData();
    }, []);

    const showNotification = (msg: string, type: 'success' | 'deleted' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const openModal = (type: 'project' | 'expertise' | 'company' | 'method') => {
        setFormData({
            title: '', type: 'UGC', media: '', desc: '', code: '',
            companyName: '', subtitle: '', items: '', footer: '', num: ''
        });
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (modalType === 'project') {
                await api.addProject({
                    title: formData.title,
                    type: formData.type,
                    media: formData.media,
                    isVideo: true
                });
                showNotification('Masterpiece added');
                const data = await api.getProjects();
                setProjects(data);
                setStats(s => ({ ...s, projects: data.length }));
            } else if (modalType === 'expertise') {
                await api.addExpertise({
                    title: formData.title,
                    desc: formData.desc,
                    code: formData.code
                });
                showNotification('Service added');
                const data = await api.getExpertise();
                setExpertise(data);
                setStats(s => ({ ...s, expertise: data.length }));
            } else if (modalType === 'company') {
                await api.addCompany(formData.companyName);
                showNotification('Company added');
                const data = await api.getCompanies();
                setCompanies(data);
                setStats(s => ({ ...s, companies: data.length }));
            } else if (modalType === 'method') {
                await api.addMethod({
                    num: formData.num,
                    title: formData.title,
                    subtitle: formData.subtitle,
                    items: formData.items.split('\n').filter(i => i.trim()),
                    footer: formData.footer
                });
                showNotification('Method step added');
                const data = await api.getMethods();
                setMethods(data);
                setStats(s => ({ ...s, methods: data.length }));
            }
            setIsModalOpen(false);
        } catch (error) {
            showNotification('Failed to add item', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bb-black text-white selection:bg-bb-gold selection:text-bb-black font-sans">
            {/* NAV */}
            <nav className="fixed top-0 w-full p-6 md:p-8 flex justify-between items-center z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/" className="block w-32 md:w-32 hover:opacity-80 transition-opacity">
                        <img src="/Black Banana.svg" alt="Black Banana" />
                    </Link>
                    <span className="px-3 py-1 bg-bb-gold/10 border border-bb-gold text-bb-gold text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Admin Console
                    </span>
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => api.logout()}
                        className="hidden md:block text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        Logout
                    </button>
                    <Link href="/" className="hidden md:block px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs font-bold tracking-widest">
                        Back to Site
                    </Link>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <main className="flex-grow pt-32 px-6 md:px-16 container mx-auto">
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold uppercase mb-2">Dashboard</h1>
                        <p className="text-white/40 font-body">Welcome back, Administrator.</p>
                    </div>
                    <div>
                        <button
                            onClick={() => openModal('project')}
                            className="px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-bb-gold text-black border border-bb-gold hover:bg-white hover:text-black transition-all"
                        >
                            + New Masterpiece
                        </button>
                    </div>
                </div>

                {/* STATS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
                    <StatCard title="Masterpieces" value={stats.projects} />
                    <StatCard title="Reviews" value={stats.reviews} />
                    <StatCard title="Services" value={stats.expertise} />
                    <StatCard title="Partners" value={stats.companies} />
                    <StatCard title="Methods" value={stats.methods} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* REVIEWS LIST */}
                    <div className="reactor-card p-8 border border-white/10 rounded-2xl bg-bb-charcoal">
                        <h2 className="text-xl font-bold uppercase mb-6 flex justify-between items-center">
                            Client Feedback
                            <Link href="/feedback" className="text-[10px] text-bb-gold border border-bb-gold/30 px-3 py-1 rounded-full hover:bg-bb-gold hover:text-black transition-colors">
                                + Manual Entry
                            </Link>
                        </h2>
                        <div className="overflow-y-auto max-h-[400px] space-y-4 no-scrollbar">
                            {reviews.map(review => (
                                <ReviewItem
                                    key={review.id}
                                    review={review}
                                    onDelete={async () => {
                                        await api.deleteReview(review.id);
                                        showNotification('Review deleted', 'deleted');
                                        // Refresh
                                        const data = await api.getReviews();
                                        setReviews(data);
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* PROJECTS LIST */}
                    <div className="reactor-card p-8 border border-white/10 rounded-2xl bg-bb-charcoal">
                        <h2 className="text-xl font-bold uppercase mb-6">Recent Masterpieces</h2>
                        <div className="overflow-y-auto max-h-[400px] space-y-2 no-scrollbar">
                            {projects.map(project => (
                                <ProjectItem
                                    key={project.id}
                                    project={project}
                                    onDelete={async () => {
                                        await api.deleteProject(project.id);
                                        showNotification('Project deleted', 'deleted');
                                        const data = await api.getProjects();
                                        setProjects(data);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* EXPERTISE LIST */}
                    <div className="reactor-card p-8 border border-white/10 rounded-2xl bg-bb-charcoal">
                        <h2 className="text-xl font-bold uppercase mb-6 flex justify-between items-center">
                            Services / Expertise
                            <button onClick={() => openModal('expertise')} className="text-[10px] text-bb-gold border border-bb-gold/30 px-3 py-1 rounded-full hover:bg-bb-gold hover:text-black transition-colors">
                                + New Service
                            </button>
                        </h2>
                        <div className="overflow-y-auto max-h-[300px] space-y-4 no-scrollbar">
                            {expertise.map(exp => (
                                <ExpertiseItem
                                    key={exp.id}
                                    item={exp}
                                    onDelete={async () => {
                                        await api.deleteExpertise(exp.id);
                                        showNotification('Service deleted', 'deleted');
                                        const data = await api.getExpertise();
                                        setExpertise(data);
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* COMPANIES LIST */}
                    <div className="reactor-card p-8 border border-white/10 rounded-2xl bg-bb-charcoal">
                        <h2 className="text-xl font-bold uppercase mb-6 flex justify-between items-center">
                            Ticker Partners
                            <button onClick={() => openModal('company')} className="text-[10px] text-bb-gold border border-bb-gold/30 px-3 py-1 rounded-full hover:bg-bb-gold hover:text-black transition-colors">
                                + New Partner
                            </button>
                        </h2>
                        <div className="overflow-y-auto max-h-[300px] space-y-2 no-scrollbar">
                            {companies.map((comp, idx) => (
                                <div key={idx} className="p-3 bg-white/5 rounded border border-white/5 flex justify-between items-center group hover:border-bb-gold transition-colors">
                                    <span className="text-sm font-bold">{comp}</span>
                                    <button onClick={async () => {
                                        await api.deleteCompany(comp);
                                        showNotification('Partner removed', 'deleted');
                                        const data = await api.getCompanies();
                                        setCompanies(data);
                                    }} className="text-white/20 hover:text-red-500 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* METHODS LIST */}
                    <div className="reactor-card p-8 border border-white/10 rounded-2xl bg-bb-charcoal md:col-span-2">
                        <h2 className="text-xl font-bold uppercase mb-6 flex justify-between items-center">
                            The Method Steps
                            <button onClick={() => openModal('method')} className="text-[10px] text-bb-gold border border-bb-gold/30 px-3 py-1 rounded-full hover:bg-bb-gold hover:text-black transition-colors">
                                + New Step
                            </button>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[400px] no-scrollbar">
                            {methods.map(meth => (
                                <div key={meth.id} className="p-4 bg-white/5 rounded-xl border border-white/5 relative group hover:border-bb-gold transition-colors">
                                    <button onClick={async () => {
                                        await api.deleteMethod(meth.id);
                                        showNotification('Step removed', 'deleted');
                                        const data = await api.getMethods();
                                        setMethods(data);
                                    }} className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                    <div className="text-2xl font-bold text-bb-gold mb-1">{meth.num}</div>
                                    <div className="font-bold uppercase text-sm mb-2">{meth.title}</div>
                                    <p className="text-[10px] text-white/40 italic mb-2 pr-6">{meth.subtitle}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="w-full max-w-md bg-bb-charcoal border border-white/10 p-8 rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-bb-gold">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <h2 className="text-2xl font-bold uppercase mb-6">
                            {modalType === 'project' && 'Add Masterpiece'}
                            {modalType === 'expertise' && 'Add Service'}
                            {modalType === 'company' && 'Add Partner'}
                            {modalType === 'method' && 'Add Method Step'}
                        </h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {modalType === 'project' && (
                                <>
                                    <input type="text" placeholder="Title" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-bb-gold outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    <select className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-bb-gold outline-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="UGC">UGC</option>
                                        <option value="Production">Production</option>
                                        <option value="Branding">Branding</option>
                                    </select>
                                    <input type="url" placeholder="Video URL (mp4)" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-bb-gold outline-none" value={formData.media} onChange={e => setFormData({ ...formData, media: e.target.value })} />
                                </>
                            )}
                            {modalType === 'expertise' && (
                                <>
                                    <input type="text" placeholder="Service Title" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-bb-gold outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    <input type="text" placeholder="Description" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-bb-gold outline-none" value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} />
                                    <input type="text" placeholder="Code (e.g., 01)" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-bb-gold outline-none" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                                </>
                            )}
                            {modalType === 'company' && (
                                <input type="text" placeholder="Partner Name" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-bb-gold outline-none" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} required />
                            )}
                            {modalType === 'method' && (
                                <>
                                    <input type="text" placeholder="Step Number (e.g., 01)" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-bb-gold outline-none" value={formData.num} onChange={e => setFormData({ ...formData, num: e.target.value })} required />
                                    <input type="text" placeholder="Step Title" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-bb-gold outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    <input type="text" placeholder="Subtitle" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-bb-gold outline-none" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
                                    <textarea placeholder="Items (one per line)" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-bb-gold outline-none h-24" value={formData.items} onChange={e => setFormData({ ...formData, items: e.target.value })} />
                                    <input type="text" placeholder="Footer Text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-bb-gold outline-none" value={formData.footer} onChange={e => setFormData({ ...formData, footer: e.target.value })} />
                                </>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-bb-gold text-black font-bold uppercase rounded hover:bg-white transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Adding...' : `Add ${modalType.toUpperCase()}`}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* TOASTS */}
            <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-2">
                {toasts.map(toast => (
                    <div key={toast.id} className={`px-6 py-4 bg-[#0F0F0F] border-l-4 ${toast.type === 'error' ? 'border-red-500' : 'border-bb-gold'} text-white shadow-2xl rounded flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300`}>
                        <div className="font-bold text-lg">{toast.type === 'error' ? '✕' : '✓'}</div>
                        <div>
                            <div className="font-bold uppercase tracking-wider text-xs opacity-60">{toast.type}</div>
                            <div className="text-sm font-medium">{toast.msg}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StatCard = ({ title, value }: { title: string, value: number }) => (
    <div className="reactor-card p-6 border border-white/10 rounded-2xl bg-bb-charcoal hover:border-bb-gold transition-all">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-2">{title}</p>
        <div className="text-3xl font-bold text-white">{value}</div>
    </div>
);

const ReviewItem = ({ review, onDelete }: { review: Review, onDelete: () => void }) => (
    <div className="p-4 bg-white/5 rounded-lg border border-white/5 group hover:border-bb-gold transition-colors relative">
        <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={onDelete} className="text-white/20 hover:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
        <div className="flex justify-between items-start mb-3 pr-12">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-full flex items-center justify-center font-bold text-white text-xs uppercase overflow-hidden">
                    {review.email ? review.email.charAt(0) : review.name.charAt(0)}
                </div>
                <div>
                    <div className="font-bold text-sm text-white">{review.name}</div>
                    {review.email && <div className="text-[10px] text-white/50 lowercase">{review.email}</div>}
                </div>
            </div>
            <div className="text-bb-gold text-xs">★ {review.rating}</div>
        </div>
        <p className="text-white/70 text-sm italic font-body">"{review.text}"</p>
    </div>
);

const ProjectItem = ({ project, onDelete }: { project: Project, onDelete: () => void }) => (
    <div className="p-3 bg-white/5 rounded border border-white/5 flex justify-between items-center group hover:border-bb-gold transition-colors">
        <div>
            <div className="font-bold text-sm text-white">{project.title}</div>
            <div className="text-xs text-white/40">{project.type}</div>
        </div>
        <div className="flex items-center gap-3">
            <div className="text-xs px-2 py-1 bg-bb-gold/10 text-bb-gold rounded">Active</div>
            <button onClick={onDelete} className="text-white/20 hover:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    </div>
);

const ExpertiseItem = ({ item, onDelete }: { item: Expertise, onDelete: () => void }) => (
    <div className="p-3 bg-white/5 rounded border border-white/5 flex justify-between items-center group hover:border-bb-gold transition-colors">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded text-bb-gold">{item.code}</div>
            <div>
                <div className="font-bold text-sm text-white">{item.title}</div>
            </div>
        </div>
        <button onClick={onDelete} className="text-white/20 hover:text-red-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
    </div>
);

export default AdminPage;
