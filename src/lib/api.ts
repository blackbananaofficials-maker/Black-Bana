/**
 * BLACK BANANA - CORE API UTILITY
 * Type-safe data fetching and authentication for Next.js.
 */

const API_BASE = (typeof window !== 'undefined' && window.location.origin.includes('localhost'))
    ? '/api'
    : (process.env.NEXT_PUBLIC_API_URL || '/api');

export interface Project {
    id: string;
    title: string;
    type: string;
    videoUrl?: string; // Matching component needs
    media?: string;   // Matching legacy data
    isVideo?: boolean;
}

export interface Review {
    id: string;
    name: string;
    role: string;
    email?: string;
    text: string;
    rating: number;
    is_featured: boolean;
}

export interface Expertise {
    id: string;
    title: string;
    desc: string;
    code: string;
    icon?: string;
}

export interface MethodStep {
    id: string;
    num: string;
    title: string;
    subtitle: string;
    items: string[];
    footer: string;
}

class BlackBananaAPI {
    private get token(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('bb_auth_token');
        }
        return null;
    }

    private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            (headers as any)['Authorization'] = `Bearer ${this.token}`;
        }

        const res = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        if (res.status === 401 || res.status === 403) {
            if (typeof window !== 'undefined') {
                this.logout();
            }
            throw new Error('Unauthorized');
        }

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'API request failed');
        }

        return res.json();
    }

    // Auth Methods
    async login(email: string, password: string): Promise<any> {
        const res = await this.fetch<any>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: email, password }),
        });
        if (res.token && typeof window !== 'undefined') {
            localStorage.setItem('bb_auth_token', res.token);
            localStorage.setItem('bb_auth_username', email);
        }
        return res;
    }

    async register(email: string, password: string, secret: string): Promise<any> {
        return this.fetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username: email, password, secret }),
        });
    }

    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('bb_auth_token');
            localStorage.removeItem('bb_auth_username');
            window.location.href = '/login';
        }
    }

    // Data Access
    async getProjects(): Promise<Project[]> {
        try {
            return await this.fetch<Project[]>('/projects');
        } catch (e) {
            console.error('API connection failed, falling back to legacy project data...');
            return [
                { id: 'mp-01', type: 'SEO', title: 'Edverb', media: '/masterpiece-01-edverb.png', isVideo: false },
                { id: 'mp-02', type: 'Branding', title: 'Pixy', media: '/masterpiece-02-pixy.png', isVideo: false },
                { id: 'mp-03', type: 'Google Ads', title: 'Shreenathji Investments', media: '/masterpiece-03-shreenathji.png', isVideo: false },
                { id: 'mp-04', type: 'Meta Ads', title: 'Anchor.Mitul', media: '/masterpiece-04-anchor.png', isVideo: false },
                { id: 'mp-05', type: 'E-Commerce', title: 'Caspera', media: '/masterpiece-05-caspera.png', isVideo: false },
            ];
        }
    }

    async addProject(project: Partial<Project>): Promise<Project> {
        return this.fetch<Project>('/projects', {
            method: 'POST',
            body: JSON.stringify(project),
        });
    }

    async deleteProject(id: string): Promise<void> {
        return this.fetch(`/projects/${id}`, { method: 'DELETE' });
    }

    async getReviews(): Promise<Review[]> {
        try {
            return await this.fetch<Review[]>('/reviews');
        } catch (e) {
            console.error('API connection failed, falling back to legacy review data...');
            return [
                { id: '1', name: 'Krutarth Kansagra', role: 'CEO, Edverb', text: 'Black Banana isn\'t an agency, they are a weapon. Our conversion rate doubled in 30 days.', rating: 5, is_featured: true },
                { id: '2', name: 'Rajesh Shah', role: 'CMO, VibeDrink', text: 'The visual identity they created for us is iconic. We consistently get asked who built our site.', rating: 5, is_featured: true },
                { id: '3', name: 'Amit Sharma', role: 'Founder, GearUp', text: 'Professional, fast, and incredibly talented. The best investment we made this year.', rating: 5, is_featured: true }
            ];
        }
    }

    async addReview(review: Partial<Review>): Promise<Review> {
        return this.fetch<Review>('/reviews', {
            method: 'POST',
            body: JSON.stringify(review),
        });
    }

    async toggleReviewFeature(id: string, isFeatured: boolean): Promise<Review> {
        return this.fetch<Review>(`/reviews/${id}/feature`, {
            method: 'PUT',
            body: JSON.stringify({ is_featured: isFeatured }),
        });
    }

    async deleteReview(id: string): Promise<void> {
        return this.fetch(`/reviews/${id}`, { method: 'DELETE' });
    }

    async getExpertise(): Promise<Expertise[]> {
        try {
            return await this.fetch<Expertise[]>('/expertise');
        } catch (e) {
            console.error('API connection failed, falling back to legacy expertise data...');
            return [
                { id: '1', code: '01', title: 'Social Media Marketing', desc: 'Building communities and driving engagement through data-backed content strategies.', icon: '<svg class="w-16 h-16 md:w-20 md:h-20 text-[#F59E0B] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>' },
                { id: '2', code: '02', title: 'SEO', desc: 'Technical and content optimization to secure top rankings on search engines.', icon: '<svg class="w-16 h-16 md:w-20 md:h-20 text-[#F59E0B] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>' },
                { id: '3', code: '03', title: 'Website Development', desc: 'Custom, high-performance websites coded to convert visitors into clients.', icon: '<svg class="w-16 h-16 md:w-20 md:h-20 text-[#F59E0B] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>' },
                { id: '4', code: '04', title: 'Meta Ads', desc: 'Laser-targeted advertising campaigns across Facebook and Instagram.', icon: '<svg class="w-16 h-16 md:w-20 md:h-20 text-[#F59E0B] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
                { id: '5', code: '05', title: 'Google Ads', desc: 'Capture intent at the moment of search with optimized PPC campaigns.', icon: '<svg class="w-16 h-16 md:w-20 md:h-20 text-[#F59E0B] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>' },
                { id: '6', code: '06', title: 'Branding', desc: 'Forging unique visual identities and voices that resonate with your market.', icon: '<svg class="w-16 h-16 md:w-20 md:h-20 text-[#F59E0B] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>' },
                { id: '7', code: '07', title: 'Social Media Handling', desc: 'Full-service account management, posting, and community interaction.', icon: '<svg class="w-16 h-16 md:w-20 md:h-20 text-[#F59E0B] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>' },
                { id: '8', code: '08', title: 'Strategy Management', desc: 'Aligning your digital efforts with broader business goals for maximum efficiency.', icon: '<svg class="w-16 h-16 md:w-20 md:h-20 text-[#F59E0B] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>' },
                { id: '9', code: '09', title: 'Strategy Marketing', desc: 'Long-term roadmaps designed to position your brand as a market leader.', icon: '<svg class="w-16 h-16 md:w-20 md:h-20 text-[#F59E0B] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>' }
            ];
        }
    }

    async addExpertise(expertise: Partial<Expertise>): Promise<Expertise> {
        return this.fetch<Expertise>('/expertise', {
            method: 'POST',
            body: JSON.stringify(expertise),
        });
    }

    async deleteExpertise(id: string): Promise<void> {
        return this.fetch(`/expertise/${id}`, { method: 'DELETE' });
    }

    async submitContact(data: any): Promise<any> {
        return this.fetch('/contact', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getCompanies(): Promise<string[]> {
        try {
            return await this.fetch<string[]>('/companies');
        } catch (e) {
            return ["Edverb", "Pixy", "Caspera", "Anchor.mitul", "Shreenathji investments", "Begum’s Pride"];
        }
    }

    async getMethods(): Promise<MethodStep[]> {
        return this.fetch<MethodStep[]>('/methods');
    }

    async addCompany(name: string): Promise<any> {
        return this.fetch('/companies', {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
    }

    async deleteCompany(name: string): Promise<any> {
        return this.fetch('/companies', {
            method: 'DELETE',
            body: JSON.stringify({ name }),
        });
    }

    async addMethod(data: Omit<MethodStep, 'id'>): Promise<MethodStep> {
        return this.fetch<MethodStep>('/methods', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deleteMethod(id: string): Promise<any> {
        return this.fetch('/methods', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    }
}

export const api = new BlackBananaAPI();
