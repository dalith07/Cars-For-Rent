import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/dashboard/admin-sidebar"
import NotificationClientWrapper from "@/components/notification/notification-wrapper"
import PresenceClientWrapper from "@/components/user/presence-client-wrapper"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <SidebarProvider>
            {/* <div className="flex min-h-screen w-full bg-accent/20"> */}
            <div className="flex min-h-screen w-full bg-slate-900 text-slate-200">
                <AdminSidebar />
                <SidebarInset className="flex flex-col flex-1 bg-slate-900 text-slate-200">
                    {/* 🔥 Client Listener */}
                    <NotificationClientWrapper />

                    {/* 🟢 Online / Offline listener */}
                    <PresenceClientWraapper />

                    {children}
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
