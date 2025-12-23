"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"

interface Order {
    id: string
    customerName: string
    carName: string
    startDate: string
    endDate: string
    totalPrice: number
    status: "Pending" | "Accepted" | "Rejected" | "Completed"
}

const MOCK_ORDERS: Order[] = [
    {
        id: "1",
        customerName: "John Smith",
        carName: "Toyota Camry 2023",
        startDate: "2024-01-15",
        endDate: "2024-01-20",
        totalPrice: 450,
        status: "Pending",
    },
    {
        id: "2",
        customerName: "Sarah Johnson",
        carName: "Honda Civic 2022",
        startDate: "2024-01-10",
        endDate: "2024-01-18",
        totalPrice: 380,
        status: "Accepted",
    },
    {
        id: "3",
        customerName: "Mike Davis",
        carName: "Ford Mustang 2023",
        startDate: "2024-01-12",
        endDate: "2024-01-14",
        totalPrice: 320,
        status: "Completed",
    },
    {
        id: "4",
        customerName: "Emily Brown",
        carName: "BMW 3 Series 2023",
        startDate: "2024-01-08",
        endDate: "2024-01-09",
        totalPrice: 200,
        status: "Rejected",
    },
    {
        id: "5",
        customerName: "Robert Wilson",
        carName: "Audi A4 2022",
        startDate: "2024-01-20",
        endDate: "2024-01-25",
        totalPrice: 520,
        status: "Pending",
    },
]

export function OrdersTable() {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)

    const handleAccept = (id: string) => {
        setOrders(orders.map((order) => (order.id === id ? { ...order, status: "Accepted" } : order)))
    }

    const handleReject = (id: string) => {
        setOrders(orders.map((order) => (order.id === id ? { ...order, status: "Rejected" } : order)))
    }

    const getStatusBadgeColor = (status: Order["status"]) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800"
            case "Accepted":
                return "bg-green-100 text-green-800"
            case "Rejected":
                return "bg-red-100 text-red-800"
            case "Completed":
                return "bg-blue-100 text-blue-800"
        }
    }

    return (
        <Card className="bg-card">
            <CardContent className="pt-6">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-foreground">Customer Name</TableHead>
                                <TableHead className="text-foreground">Car Name</TableHead>
                                <TableHead className="text-foreground">Rental Period</TableHead>
                                <TableHead className="text-foreground">Total Price</TableHead>
                                <TableHead className="text-foreground">Status</TableHead>
                                <TableHead className="text-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} className="border-border">
                                    <TableCell className="text-foreground">{order.customerName}</TableCell>
                                    <TableCell className="text-foreground">{order.carName}</TableCell>
                                    <TableCell className="text-foreground">
                                        {order.startDate} – {order.endDate}
                                    </TableCell>
                                    <TableCell className="text-foreground">${order.totalPrice}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {order.status === "Pending" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() => handleAccept(order.id)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleReject(order.id)}
                                                        className="border-red-600 text-red-600 hover:bg-red-50"
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            {order.status !== "Pending" && <span className="text-sm text-muted-foreground">—</span>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
