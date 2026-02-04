import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { CompanySidebar } from "@/components/company/company-sidebar"

export default function CompanyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <CompanySidebar />
            <SidebarInset className="bg-emerald-50">{children}</SidebarInset>
        </SidebarProvider>
    )
}
