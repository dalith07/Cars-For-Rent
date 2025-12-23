"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
} from "@/components/ui/sidebar"

import {
    LayoutDashboard,
    Car,
    ShoppingCart,
    Building2,
    Settings,
} from "lucide-react"

import { SidebarLink } from "@/components/company/sidebar-link"

export function CompanySidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <h2 className="text-xl font-bold">Company</h2>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>

                            <SidebarLink
                                href="/company/dashboard"
                                label="Dashboard"
                                icon={LayoutDashboard}
                            />

                            <SidebarLink
                                href="/company/cars"
                                label="My Cars"
                                icon={Car}
                            />

                            <SidebarLink
                                href="/company/orders"
                                label="Orders"
                                icon={ShoppingCart}
                            />

                            <SidebarLink
                                href="/company/profile"
                                label="Company Profile"
                                icon={Building2}
                            />

                            <div className="my-4 h-px w-full bg-black/20 rounded-full hidden sm:block" />

                            <SidebarLink
                                href="/company/settings"
                                label="Settings"
                                icon={Settings}
                            />

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
