"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Car, DollarSign, UserCheck, AlertCircle } from "lucide-react"
import { useState } from "react"
import { CompanyHeader } from "@/components/company/company-header"

const notifications = [
    {
        id: 1,
        type: "order",
        title: "New Rental Order",
        message: "John Smith requested to rent Tesla Model 3",
        time: "5 minutes ago",
        read: false,
        icon: Bell,
    },
    {
        id: 2,
        type: "payment",
        title: "Payment Received",
        message: "Payment of $850 received from Sarah Johnson",
        time: "1 hour ago",
        read: false,
        icon: DollarSign,
    },
    {
        id: 3,
        type: "car",
        title: "Car Returned",
        message: "BMW X5 has been returned by Mike Davis",
        time: "3 hours ago",
        read: true,
        icon: Car,
    },
    {
        id: 4,
        type: "order",
        title: "Order Confirmed",
        message: "Emily Brown confirmed the rental of Audi A4",
        time: "5 hours ago",
        read: true,
        icon: UserCheck,
    },
    {
        id: 5,
        type: "alert",
        title: "Maintenance Due",
        message: "Mercedes C-Class is due for maintenance check",
        time: "1 day ago",
        read: true,
        icon: AlertCircle,
    },
    {
        id: 6,
        type: "order",
        title: "New Rental Request",
        message: "David Wilson wants to rent Toyota Camry",
        time: "2 days ago",
        read: true,
        icon: Bell,
    },
]

export default function NotificationsPage() {
    const [typeFilter, setTypeFilter] = useState("all")
    const [readFilter, setReadFilter] = useState("all")

    const filteredNotifications = notifications.filter((notification) => {
        const matchesType = typeFilter === "all" || notification.type === typeFilter
        const matchesRead = readFilter === "all" || (readFilter === "unread" ? !notification.read : notification.read)
        return matchesType && matchesRead
    })

    return (
        <div className="flex flex-1 flex-col">
            <CompanyHeader title="Notifications" description="Stay updated with your business activities" />
            <main className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {notifications.filter((n) => !n.read).length} unread notifications
                    </p>
                    <Button variant="outline" size="sm">
                        Mark all as read
                    </Button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="order">Orders</SelectItem>
                            <SelectItem value="payment">Payments</SelectItem>
                            <SelectItem value="car">Cars</SelectItem>
                            <SelectItem value="alert">Alerts</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={readFilter} onValueChange={setReadFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="unread">Unread</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                        <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                            <notification.icon className="size-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{notification.title}</CardTitle>
                                            <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                                            <p className="mt-2 text-xs text-muted-foreground">{notification.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!notification.read && <Badge variant="default">New</Badge>}
                                        <Button variant="ghost" size="sm">
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}
