"use client"

import { Home, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

const pageNames: Record<string, string> = {
    "/company/dashboard": "Dashboard",
    "/company/cars": "My Cars",
    "/company/orders": "Orders",
    "/company/profile": "Company Profile",
    "/company/settings": "Settings",
}

export function PageHeader() {
    const pathname = usePathname()
    const pageName = pageNames[pathname] || "Dashboard"

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-foreground">{pageName}</h1>
            </div>

            <div className="flex items-center gap-2">
                <Link href="/company/dashboard">
                    <Button variant="outline" title="Go to Home">
                        <Home className="h-5 w-5" />
                        <span className="sr-only">Home</span>
                    </Button>
                </Link>
                <Button variant="outline" title="Notifications">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
            </div>
        </header>
    )
}
