'use client';

import { useSession, signOut } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

export default function BannedGuard({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session?.user?.isBanned) {
            alert(session.error || "Your account has been blocked!");
            signOut();
        }
    }, [session]);

    if (status === "loading") return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="flex flex-col items-center gap-4">
                {/* 🔹 Spinner */}
                <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-gray-700 rounded-full animate-spin"></div>
                {/* 🔹 Loading text */}
                {/* <p className="text-white text-lg font-medium">Loading, please wait...</p> */}
            </div>
        </div>
    );

    return <>{children}</>;
}
