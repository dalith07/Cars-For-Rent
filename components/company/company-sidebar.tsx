"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Car, FileText, Building2, Settings, ShoppingCart, Bell } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { useCurrentUser } from "@/hooks/use-current-user"
import Image from "next/image"

const navigation = [
    {
        title: "Dashboard",
        href: "/company",
        icon: LayoutDashboard,
    },
    {
        title: "Cars",
        href: "/company/cars",
        icon: Car,
    },
    {
        title: "Market Cars",
        href: "/company/market-cars",
        icon: ShoppingCart,
    },
    {
        title: "Orders",
        href: "/company/orders",
        icon: FileText,
    },
    {
        title: "Notifications",
        href: "/company/notifications",
        icon: Bell,
    },
    {
        title: "Company Profile",
        href: "/company/profile",
        icon: Building2,
    },
    {
        title: "Settings",
        href: "/company/settings",
        icon: Settings,
    },
]

export function CompanySidebar() {
    const pathname = usePathname()
    const user = useCurrentUser()

    return (
        <Sidebar className="bg-emerald-800 text-emerald-100">
            <SidebarHeader className="border-b border-emerald-900 p-3 bg-emerald-900">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Building2 />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Company Portal</span>
                        <span className="text-xs text-gray-400">Rental Management</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="bg-emerald-950">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-400 mb-2">Navigation:</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild isActive={isActive}
                                            className="hover:bg-emerald-800 duration-300 hover:text-white
                                            data-[active=true]:bg-emerald-700
                                            data-[active=true]:text-white"
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            <SidebarFooter className="border-t bg-emerald-900 border-emerald-800 p-4">
                <div className="flex items-center gap-3">
                    <div className="border border-primary/20 rounded-full">
                        <Image
                            width={70}
                            height={70}
                            src={user?.image || "/logo_user.png"}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-medium">{user?.name}</span>
                        <span className="text-xs text-slate-300">{user?.email}</span>
                    </div>
                </div>
            </SidebarFooter>

            {/* <SidebarFooter className="border-t border-sidebar-border p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="size-2 rounded-full bg-green-500" />
                    <span>All systems operational</span>
                </div>
            </SidebarFooter> */}
        </Sidebar>
    )
}
