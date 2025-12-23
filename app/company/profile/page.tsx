"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Car, ShoppingCart, Building2, Settings } from "lucide-react"
import { PageHeader } from "@/components/company/page-header"

export default function CompanyProfilePage() {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <h2 className="text-xl font-bold">Company</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/company/dashboard">
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span>Dashboard</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/company/cars">
                                            <Car className="h-4 w-4" />
                                            <span>My Cars</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/company/orders">
                                            <ShoppingCart className="h-4 w-4" />
                                            <span>Orders</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive>
                                        <a href="/company/profile">
                                            <Building2 className="h-4 w-4" />
                                            <span>Company Profile</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/company/settings">
                                            <Settings className="h-4 w-4" />
                                            <span>Settings</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>

            <SidebarInset>
                <PageHeader />

                <main className="flex-1 overflow-auto">
                    <div className="p-4 md:p-8">
                        <div className="mt-8 max-w-2xl space-y-6">
                            {/* Company Info Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Company Information</CardTitle>
                                    <CardDescription>View and manage your company details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-muted-foreground">Company Name</label>
                                            <p className="text-lg font-semibold">Premium Auto Rentals Inc.</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">Business Type</label>
                                            <p className="text-lg font-semibold">Car Rental Service</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">Registration Number</label>
                                            <p className="text-lg font-semibold">BRN-2021-456789</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">Tax ID</label>
                                            <p className="text-lg font-semibold">TAX-98765432</p>
                                        </div>
                                    </div>
                                    <Button variant="outline">Edit Company Info</Button>
                                </CardContent>
                            </Card>

                            {/* Contact Information Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                    <CardDescription>Primary contact details for your company</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-muted-foreground">Email</label>
                                            <p className="text-lg font-semibold">info@premiumrentalz.com</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">Phone</label>
                                            <p className="text-lg font-semibold">+1 (555) 123-4567</p>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="text-sm text-muted-foreground">Address</label>
                                            <p className="text-lg font-semibold">123 Business Street, Suite 500, City, State 12345</p>
                                        </div>
                                    </div>
                                    <Button variant="outline">Edit Contact Info</Button>
                                </CardContent>
                            </Card>

                            {/* Business Stats Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Business Statistics</CardTitle>
                                    <CardDescription>Your company performance metrics</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="rounded-lg bg-muted p-4 text-center">
                                            <p className="text-sm text-muted-foreground">Total Vehicles</p>
                                            <p className="text-2xl font-bold">24</p>
                                        </div>
                                        <div className="rounded-lg bg-muted p-4 text-center">
                                            <p className="text-sm text-muted-foreground">Total Rentals</p>
                                            <p className="text-2xl font-bold">142</p>
                                        </div>
                                        <div className="rounded-lg bg-muted p-4 text-center">
                                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                                            <p className="text-2xl font-bold">$28,950</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
