"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Bell, Building2, Car, FileCog, Home, LayoutDashboard, Settings, ShoppingBasket } from "lucide-react"

const navItems = [
    { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
    { label: "My Cars", href: "/company/cars", icon: Car },
    { label: "Orders", href: "/company/orders", icon: ShoppingBasket },
    { label: "Company Profile", href: "/company/profile", icon: FileCog },
    { label: "Notification", href: "/company/notification", icon: Bell },

    { label: "Settings", href: "/company/settings", icon: Settings },
    { label: "Market Cars", href: "/market-cars", icon: Home },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/20 bg-black/10  backdrop-blur-sm hidden md:block">
            <div className="p-6 flex text-white items-center gap-4 font-bold text-xl">
                <Building2 /> Company
            </div>

            <nav className="space-y-1 px-3">
                {navItems.map(item => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link href={item.href} key={item.label}>
                            <button
                                className={cn(
                                    "w-full text-white duration-500 hover:cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg transition",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-primary/20"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    {item.label}
                                </span>
                            </button>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}

