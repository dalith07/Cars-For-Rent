"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import type { LucideIcon } from "lucide-react"

interface SidebarLinkProps {
    href: string
    label: string
    icon: LucideIcon
}

export function SidebarLink({ href, label, icon: Icon }: SidebarLinkProps) {
    const pathname = usePathname()

    const isActive =
        pathname === href || pathname.startsWith(`${href}/`)

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                className={
                    isActive
                        ? "bg-blue-600 text-white hover:bg-blue-600"
                        : "hover:bg-muted"
                }
            >
                <Link href={href}>
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}
