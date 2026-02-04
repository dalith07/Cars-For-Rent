'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, } from 'react';
import BannedGuard from './banned-guard';

export default function Providers({ children }: { children: ReactNode }) {

    return (
        <SessionProvider>
            <BannedGuard>
                {children}
            </BannedGuard>
        </SessionProvider>
    );
}
