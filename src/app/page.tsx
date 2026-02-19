'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { verifyAuth } from '@/lib/auth';

export default function HomePage() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        checkAuthAndRedirect();
    }, []);

    const checkAuthAndRedirect = async () => {
        try {
            const { authenticated } = await verifyAuth();

            if (authenticated) {
                router.push('/dashboard');
            } else {
                router.push('/login');
            }
        } catch (error) {
            router.push('/login');
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="animate-spin text-primary-purple mx-auto mb-4" size={48} />
                <p className="text-text-secondary">Redirecting...</p>
            </div>
        </div>
    );
}
