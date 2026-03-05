-- Supabase Database Initialization Script
-- Run this entire script in the Supabase SQL Editor to create tables and seed default data.

-- 1. Create Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Default Admin (You should change this password later)
INSERT INTO public.admins (username, password)
VALUES ('admin@blackbanana.com', 'password123')
ON CONFLICT (username) DO NOTHING;


-- 2. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    media TEXT NOT NULL,
    "isVideo" BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Default Projects
INSERT INTO public.projects (type, title, media, "isVideo") VALUES
    ('UGC', 'Fashion Week', 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-recording-a-video-on-her-phone-39739-large.mp4', true),
    ('Production', 'Night Life', 'https://assets.mixkit.co/videos/preview/mixkit-fireworks-illuminating-the-beach-at-night-4168-large.mp4', true),
    ('Influencer', 'Neon Dance', 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4', true),
    ('Branding', 'Fluid Identity', 'https://video.wixstatic.com/video/11062b_92619c730c4b4b0bb27ea39c4276a53b/1080p/mp4/file.mp4', true),
    ('CGI', 'Cosmos', 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4', true);


-- 3. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT,
    text TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Default Reviews
INSERT INTO public.reviews (name, role, text, rating) VALUES
    ('Krutarth Kansagra', 'CEO, Edverb', 'Black Banana isn''t an agency, they are a weapon. Our conversion rate doubled in 30 days.', 5),
    ('Rajesh Shah', 'CMO, VibeDrink', 'The visual identity they created for us is iconic. We consistently get asked who built our site.', 5),
    ('Amit Sharma', 'Founder, GearUp', 'Professional, fast, and incredibly talented. The best investment we made this year.', 5);


-- 4. Create Expertise Table
CREATE TABLE IF NOT EXISTS public.expertise (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Default Expertise
INSERT INTO public.expertise (code, title, "desc", icon) VALUES
    ('01', 'Social Media Marketing', 'Building communities and driving engagement through data-backed content strategies.', '<svg class="w-16 h-16 md:w-20 md:h-20 text-bb-gold mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>'),
    ('02', 'SEO', 'Technical and content optimization to secure top rankings on search engines.', '<svg class="w-16 h-16 md:w-20 md:h-20 text-bb-gold mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>'),
    ('03', 'Website Development', 'Custom, high-performance websites coded to convert visitors into clients.', '<svg class="w-16 h-16 md:w-20 md:h-20 text-bb-gold mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>'),
    ('04', 'Meta Ads', 'Laser-targeted advertising campaigns across Facebook and Instagram.', '<svg class="w-16 h-16 md:w-20 md:h-20 text-bb-gold mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'),
    ('05', 'Google Ads', 'Capture intent at the moment of search with optimized PPC campaigns.', '<svg class="w-16 h-16 md:w-20 md:h-20 text-bb-gold mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>'),
    ('06', 'Branding', 'Forging unique visual identities and voices that resonate with your market.', '<svg class="w-16 h-16 md:w-20 md:h-20 text-bb-gold mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>'),
    ('07', 'Social Media Handling', 'Full-service account management, posting, and community interaction.', '<svg class="w-16 h-16 md:w-20 md:h-20 text-bb-gold mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>'),
    ('08', 'Strategy Management', 'Aligning your digital efforts with broader business goals for maximum efficiency.', '<svg class="w-16 h-16 md:w-20 md:h-20 text-bb-gold mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>'),
    ('09', 'Strategy Marketing', 'Long-term roadmaps designed to position your brand as a market leader.', '<svg class="w-16 h-16 md:w-20 md:h-20 text-bb-gold mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>');


-- 5. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
