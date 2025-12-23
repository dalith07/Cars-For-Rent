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

export default function SettingsPage() {
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
                                    <SidebarMenuButton asChild>
                                        <a href="/company/profile">
                                            <Building2 className="h-4 w-4" />
                                            <span>Company Profile</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive>
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
                            {/* Account Settings Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                    <CardDescription>Manage your account preferences and security</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-border gap-3">
                                        <div>
                                            <p className="font-semibold">Change Password</p>
                                            <p className="text-sm text-muted-foreground">Update your account password</p>
                                        </div>
                                        <Button variant="outline">Change</Button>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-border gap-3">
                                        <div>
                                            <p className="font-semibold">Two-Factor Authentication</p>
                                            <p className="text-sm text-muted-foreground">Enable 2FA for added security</p>
                                        </div>
                                        <Button variant="outline">Enable</Button>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
                                        <div>
                                            <p className="font-semibold">Email Notifications</p>
                                            <p className="text-sm text-muted-foreground">Manage email notification preferences</p>
                                        </div>
                                        <Button variant="outline">Configure</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Settings Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Settings</CardTitle>
                                    <CardDescription>Configure payment methods and billing information</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-border gap-3">
                                        <div>
                                            <p className="font-semibold">Payment Methods</p>
                                            <p className="text-sm text-muted-foreground">Manage your saved payment methods</p>
                                        </div>
                                        <Button variant="outline">Manage</Button>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-border gap-3">
                                        <div>
                                            <p className="font-semibold">Billing Address</p>
                                            <p className="text-sm text-muted-foreground">Update your billing information</p>
                                        </div>
                                        <Button variant="outline">Update</Button>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
                                        <div>
                                            <p className="font-semibold">Invoices</p>
                                            <p className="text-sm text-muted-foreground">View and download your invoices</p>
                                        </div>
                                        <Button variant="outline">View</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notification Preferences Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                    <CardDescription>Choose how you want to be notified</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-border gap-3">
                                        <div>
                                            <p className="font-semibold">Rental Confirmations</p>
                                            <p className="text-sm text-muted-foreground">Receive confirmation for new rentals</p>
                                        </div>
                                        <input type="checkbox" className="h-5 w-5" defaultChecked />
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-border gap-3">
                                        <div>
                                            <p className="font-semibold">Order Updates</p>
                                            <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                                        </div>
                                        <input type="checkbox" className="h-5 w-5" defaultChecked />
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
                                        <div>
                                            <p className="font-semibold">Marketing Emails</p>
                                            <p className="text-sm text-muted-foreground">Receive promotional content and updates</p>
                                        </div>
                                        <input type="checkbox" className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Danger Zone Card */}
                            <Card className="border-destructive">
                                <CardHeader>
                                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                    <CardDescription>Irreversible actions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="destructive" className="w-full">
                                        Delete Account
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
