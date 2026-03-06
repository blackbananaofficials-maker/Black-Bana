import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB, supabase } from '@/lib/db';
import nodemailer from 'nodemailer';
import xss from 'xss';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, company, message } = body;

        // Sanitize inputs
        const cleanName = xss(name);
        const cleanEmail = xss(email);
        const cleanCompany = xss(company || 'Direct');
        const cleanMessage = xss(message);

        const messageInfo = {
            name: cleanName,
            email: cleanEmail,
            company: cleanCompany,
            message: cleanMessage,
            created_at: new Date().toISOString()
        };

        // 1. Data Persistence
        if (supabase) {
            const { error } = await supabase.from('messages').insert([messageInfo]);
            if (error) console.error('Supabase message log error:', error);
        } else {
            const db = getLocalDB();
            db.messages = db.messages || [];
            db.messages.unshift({ ...messageInfo, id: Date.now().toString() });
            saveLocalDB(db);
        }

        // 2. Email Notification
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // true for 465, false for 587
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: `"Black Banana Lead Bot" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_USER,
                replyTo: cleanEmail,
                subject: `🔥 NEW LEAD: ${cleanName} @ ${cleanCompany}`,
                html: `
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 16px; border: 1px solid #222; max-width: 600px; margin: 0 auto;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #F59E0B; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-size: 24px;">New Growth Lead</h1>
                            <p style="color: #666; font-size: 14px; margin-top: 5px;">Captured from Black Banana Digital Empire</p>
                        </div>
                        
                        <div style="background-color: #0A0A0A; padding: 25px; border-radius: 12px; border: 1px solid #1a1a1a;">
                            <div style="margin-bottom: 20px;">
                                <label style="color: #F59E0B; text-transform: uppercase; font-size: 11px; font-weight: bold; letter-spacing: 1px;">Strategic Partner</label>
                                <p style="margin: 5px 0 0 0; font-size: 18px; color: #fff;">${cleanName}</p>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="color: #F59E0B; text-transform: uppercase; font-size: 11px; font-weight: bold; letter-spacing: 1px;">Company / Brand</label>
                                <p style="margin: 5px 0 0 0; font-size: 16px; color: #fff;">${cleanCompany}</p>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="color: #F59E0B; text-transform: uppercase; font-size: 11px; font-weight: bold; letter-spacing: 1px;">Direct Contact</label>
                                <p style="margin: 5px 0 0 0; font-size: 16px; color: #fff; font-style: italic;">${cleanEmail}</p>
                            </div>
                            
                            <div style="border-top: 1px solid #222; padding-top: 20px; margin-top: 10px;">
                                <label style="color: #F59E0B; text-transform: uppercase; font-size: 11px; font-weight: bold; letter-spacing: 1px;">Mission Brief</label>
                                <p style="margin: 10px 0 0 0; line-height: 1.6; color: #ccc;">${cleanMessage}</p>
                            </div>
                        </div>

                        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #444;">
                            <p>This is an automated transmission. Acknowledge and proceed with aggression.</p>
                            <p>&copy; ${new Date().getFullYear()} BLACK BANANA OFFICIALS</p>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Contact API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
