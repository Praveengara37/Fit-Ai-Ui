import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'FitAI - AI-Powered Fitness & Nutrition',
    description: 'Transform your fitness journey with AI-powered workouts and personalized nutrition plans',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
            <body className={inter.className}>
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(0, 191, 255, 0.1))',
                            border: '2px solid rgba(138, 43, 226, 0.3)',
                            color: '#ffffff',
                            backdropFilter: 'blur(10px)',
                        },
                    }}
                />
            </body>
        </html>
    );
}
