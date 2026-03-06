import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import GlobalLoader from "@/components/GlobalLoader";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "BLACK BANANA | Digital Empire",
    description: "We are a digital-first agency obsessed with performance, aesthetics, and code. We don't just build websites; we build digital empires.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased selection:bg-bb-gold selection:text-bb-black bg-bb-black text-white`}>
                <Preloader />
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
