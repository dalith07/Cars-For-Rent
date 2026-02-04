"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, Car, Users, FileText, Settings, LogOut, Plus, MessageSquareMore } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    useSidebar,
} from "@/components/ui/sidebar"

const adminLinks = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Companies", icon: Building2, href: "/dashboard/companies" },
    { name: "All Vehicles", icon: Car, href: "/dashboard/vehicles" },
    { name: "Users", icon: Users, href: "/dashboard/users" },
    { name: "System Logs", icon: FileText, href: "/dashboard/logs" },
    { name: "Chat", icon: MessageSquareMore, href: "/dashboard/chat" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { state } = useSidebar()

    return (
        <Sidebar
            variant="inset"
            className="border-r border-slate-800 bg-gray-900 text-slate-200"
        >
            {/* <SidebarHeader className="h-16 flex flex-row items-center px-4 border-b"> */}
            <SidebarHeader className="h-16 flex flex-row items-center px-4 border-b border-slate-800 bg-gray-900">
                <div className="flex items-center gap-2 overflow-hidden transition-all">
                    <div className="bg-primary rounded-lg p-1 text-primary-foreground shrink-0">
                        <Car className="h-5 w-5" />
                    </div>
                    {state === "expanded" && (
                        <span className="font-bold text-lg tracking-tight italic">
                            FLEET<span className="text-primary">FLOW</span>
                            <span className="ml-2 text-[10px] font-normal not-italic px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                ADMIN
                            </span>
                        </span>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent className="bg-slate-800">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 text-white">Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="px-2">
                            {adminLinks.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <SidebarMenuItem key={link.name}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={link.name}
                                            className={cn(
                                                "transition-all",
                                                isActive
                                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                                                    : "hover:bg-accent/80",
                                                // isActive
                                                //     ? "bg-primary text-primary-foreground shadow-md"
                                                //     : "hover:bg-slate-800 text-slate-300 hover:text-white"
                                            )}
                                        >
                                            <Link href={link.href}>
                                                <link.icon
                                                    className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")}
                                                />
                                                <span>{link.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* {state === "expanded" && (
                    <div className="mt-auto p-4 mb-4 mx-4 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 border border-primary/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                                <Plus className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold">New Company</p>
                                <p className="text-[10px] text-muted-foreground">Add to system</p>
                            </div>
                        </div>
                        <Button size="sm" className="w-full text-[11px] h-7">
                            Create Listing
                        </Button>
                    </div>
                )} */}
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-800 p-2 bg-gray-900">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="hover:bg-red-500/10 hover:text-red-400 transition-colors">
                            <LogOut className="h-4 w-4" />
                            <span>Log out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
