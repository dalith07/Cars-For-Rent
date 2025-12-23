"use client"
import {
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar"

import { PageHeader } from "@/components/company/page-header"
import { CompanySidebar } from "@/components/company/company-sidebar"

export default function CompanyDashboard() {

    return (
        <SidebarProvider>
            <CompanySidebar />

            <SidebarInset>
                <PageHeader />
                {/* cars content */}
            </SidebarInset>
        </SidebarProvider>


    )
}
