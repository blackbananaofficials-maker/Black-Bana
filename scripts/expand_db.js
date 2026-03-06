const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(process.cwd(), 'data/db.json');

try {
    if (fs.existsSync(DB_FILE)) {
        const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

        // 1. Restore Companies
        db.companies = ["Edverb", "Pixy", "Caspera", "Anchor.mitul", "Shreenathji investments", "Begum’s Pride"];

        // 2. Restore Methods (matches latest user request)
        db.methods = [
            {
                num: "01",
                title: "DISSECT",
                subtitle: "We rip your brand apart.",
                items: ["Brutal brand audit", "Competitor weaknesses exposed", "Offer positioning correction", "Revenue leak detection"],
                footer: "👉 If it's broken, we fix it. If it's weak, we replace it.",
                id: "m1"
            },
            {
                num: "02",
                title: "WEAPONIZE",
                subtitle: "Strategy becomes your unfair advantage.",
                items: ["High-converting funnel architecture", "Offer stacking psychology", "Content built to trigger action", "Paid acquisition battle plan"],
                footer: "👉 Every asset built to dominate attention.",
                id: "m2"
            },
            {
                num: "03",
                title: "BUILD TO CONVERT",
                subtitle: "Pretty is useless. Profitable wins.",
                items: ["Landing pages engineered for conversions", "Ad creatives designed to interrupt", "Copy that forces decisions", "Automation that closes while you sleep"],
                footer: "👉 No vanity metrics. Only revenue metrics.",
                id: "m3"
            },
            {
                num: "04",
                title: "ATTACK THE MARKET",
                subtitle: "Launch hard. Optimize harder.",
                items: ["Aggressive campaign deployment", "Real-time A/B testing", "Cost-per-lead compression", "Data-driven scaling"],
                footer: "👉 We don't \"try ads.\" We control them.",
                id: "m4"
            },
            {
                num: "05",
                title: "SCALE WITHOUT MERCY",
                subtitle: "Once it works, we push.",
                items: ["Budget scaling frameworks", "Retargeting domination", "Funnel multipliers", "Authority positioning"],
                footer: "👉 From traction to takeover.",
                id: "m5"
            }
        ];

        // 3. Restore Expertise (Full list of 9 items recovered from legacy fallbacks)
        db.expertise = [
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

        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        console.log('Database expanded with companies and methods.');
    }
} catch (e) {
    console.error('Error during expansion:', e);
}
