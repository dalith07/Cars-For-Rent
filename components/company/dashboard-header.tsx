"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, Home } from "lucide-react";

const titles: Record<string, { title: string; description?: string }> = {
    "/company/dashboard": {
        title: "Company Dashboard",
        description: "Overview of your rental business",
    },
    "/company/cars": {
        title: "My Cars",
        description: "Manage your fleet",
    },
    "/company/cars/new": {
        title: "My Cars",
        description: "Create New Cars",
    },
    "/company/orders": {
        title: "Orders",
        description: "Track customer rentals",
    },
    "/company/profile": {
        title: "Company Profile",
    },
    "/company/settings": {
        title: "Settings",
    },
    "/company/notification": { title: "Notifications", description: "User messages" }, // ✅ ADD THIS
}

export function DashboardHeader() {
    const pathname = usePathname()
    const router = useRouter()
    const page = titles[pathname]

    if (!page) return null

    return (
        <div
            className="sticky top-0 z-999 bg-black/10 backdrop-blur-md border-b border-white/20 px-6 py-4 flex items-center justify-between "
        >
            {/* LEFT SIDE (Title + Description) */}
            <div>
                <h1 className="text-2xl font-bold text-white">{page.title}</h1>
                {page.description && (
                    <p className="text-gray-400 opacity-80">{page.description}</p>
                )}
            </div>

            {/* RIGHT SIDE (Buttons) */}
            <div className="flex items-center gap-2">
                <Button
                    onClick={() => router.push("/company/notification")}
                >
                    <Bell />
                </Button>

                <Button
                    variant="outline"
                    onClick={() => router.push("/company/dashboard")}
                >
                    <Home />
                </Button>
            </div>
        </div>
    )
}
