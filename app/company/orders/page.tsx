"use client"
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

// Mock data for orders
const mockOrders = [
    { id: 1, customer: "John Smith", car: "Tesla Model 3", date: "2025-01-15", status: "Completed", amount: "$245.00" },
    { id: 2, customer: "Sarah Johnson", car: "BMW 5 Series", date: "2025-01-18", status: "Pending", amount: "$380.00" },
    { id: 3, customer: "Michael Chen", car: "Audi A4", date: "2025-01-20", status: "Completed", amount: "$210.00" },
    {
        id: 4,
        customer: "Emma Davis",
        car: "Mercedes C-Class",
        date: "2025-01-22",
        status: "In Progress",
        amount: "$425.00",
    },
    { id: 5, customer: "Robert Wilson", car: "Toyota Camry", date: "2025-01-23", status: "Pending", amount: "$165.00" },
    { id: 6, customer: "Lisa Anderson", car: "Honda Accord", date: "2025-01-24", status: "Completed", amount: "$195.00" },
]

export default function OrdersPage() {
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
                                    <SidebarMenuButton asChild isActive>
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
                        <div className="mt-8 overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Order ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Customer</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Car</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                                            <td className="px-4 py-3 text-sm">#{order.id}</td>
                                            <td className="px-4 py-3 text-sm">{order.customer}</td>
                                            <td className="px-4 py-3 text-sm">{order.car}</td>
                                            <td className="px-4 py-3 text-sm">{order.date}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${order.status === "Completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : order.status === "In Progress"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-semibold">{order.amount}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
