// import type React from "react"
// import type { Metadata, Viewport } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
// import Sidebar from "@/components/dashboard/sidebar"
// const _geist = Geist({ subsets: ["latin"] })
// const _geistMono = Geist_Mono({ subsets: ["latin"] })

// export const metadata: Metadata = {
//     title: "Admin Dashboard - Premium Control Panel",
//     description: "Advanced admin dashboard with real-time analytics and smooth animations",
//     icons: {
//         icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
//     },
// }

// export const viewport: Viewport = {
//     themeColor: "#000000",
// }

// export default function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode
// }>) {
//     return (
//         <Sidebar>

//         </Sidebar>
//         // <html lang="en" >
//         //     {/* <body className={`font-sans antialiased bg-background text-foreground`}> */}
//         //     <body>
//         //         <main>
//         //             {children}
//         //         </main>
//         //     </body>
//         // </html>
//     )
// }


// import type React from "react"
// import type { Metadata, Viewport } from "next"
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/dashboard/sidebar"

// export const metadata: Metadata = {
//     title: "Admin Dashboard",
//     description: "admin dashboard",
//     icons: {
//         icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
//     },
// }

// export const viewport: Viewport = {
//     themeColor: "#000000",
// }

// export default async function DashboardLayout({
//     children,
// }: {
//     children: React.ReactNode
// }) {
//     return (
//         <SidebarProvider>
//             <AppSidebar />
//             <SidebarInset>
//                 {children}
//             </SidebarInset>
//         </SidebarProvider>
//     )
// }

"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="flex h-screen">
            {/* SIDEBAR FIXED */}
            <div className="fixed left-0 top-0 h-full z-40">
                <AppSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </div>

            {/* MAIN AREA */}
            <div className="flex flex-col flex-1 ml-64 h-full">

                {/* HEADER FIXED */}
                <div className="fixed left-64 right-0 top-0 z-30 bg-background shadow">
                    <Header
                        onToggleSidebar={() => setIsOpen(!isOpen)}
                        onNotificationsClick={() => setShowNotifications(!showNotifications)}
                        showNotifications={showNotifications}
                    />
                </div>

                {/* CONTENT — scrollable */}
                <main className="flex-1 overflow-auto mt-[72px] p-6 lg:p-8">
                    {children}
                </main>

            </div>
        </div>
    );
}
