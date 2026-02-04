/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { CompanyHeader } from "@/components/company/company-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EllipsisVertical, Eye, Search, Trash2 } from "lucide-react"
import { OrderItem } from "@/lib/utils"
import { PaymentStatus, RentalStatus } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { removeOrder, updateOrderStatus, updatePaymentStatus } from "@/actions/company/order"
import { toast } from "sonner"

interface OrderUserProps {
    orders: OrderItem[]
}

export default function OrdersClientPage({ orders }: OrderUserProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "PENDING" | "ACCEPTED" | "COMPLETED" | "REJECTED">("all")

    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null)
    const [openDialog, setOpenDialog] = useState(false)


    // 🔹 map orders to ensure car name is present
    const mappedOrders = orders.map(o => ({
        ...o,
        car: {
            name: o.car?.name ?? (o.orderCars?.[0]?.car?.name ?? "Unknown")
        },
        user: {
            name: o.user?.name ?? "Unknown"
        }
    }))

    const filteredOrders = mappedOrders.filter(order => {
        const customerName = order.user.name
        const carName = order.car.name

        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            carName.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || order.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const getStatusBadgeClass = (status: RentalStatus) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            case "ACCEPTED":
                return "bg-green-500/20 text-green-400 border-green-500/30"
            case "COMPLETED":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "REJECTED":
                return "bg-red-500/20 text-red-400 border-red-500/30"
            case "CANCELLED":
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
            default:
                return ""
        }
    }

    // helper for display text
    const formatStatusText = (status: RentalStatus | string) => {
        switch (status) {
            case "PENDING": return "Pending"
            case "ACCEPTED": return "Accepted"
            case "COMPLETED": return "Completed"
            case "REJECTED": return "Rejected"
            case "CANCELLED": return "Cancelled"
            default: return "Unknown"
        }
    }

    return (
        <div className="flex flex-1 flex-col">
            <CompanyHeader title="Orders" description="View and manage all rental orders" />

            <main className="flex flex-1 flex-col gap-6 p-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-amber-800 text-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mappedOrders.filter(o => o.status === "PENDING").length}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-800 text-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mappedOrders.filter(o => o.status === "ACCEPTED").length}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-800 text-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mappedOrders.filter(o => o.status === "COMPLETED").length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders Table */}
                <Card className="bg-amber-800 text-white">
                    <CardHeader>
                        <CardTitle>All Orders</CardTitle>
                        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search by customer or car..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-amber-700 border-amber-600 text-white placeholder:text-white/70 focus:ring-2 focus:ring-amber-600"
                                />
                            </div>

                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                                <SelectTrigger className="w-full sm:w-[180px] bg-amber-700 border-amber-600">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent className="bg-amber-900 border-amber-700 text-white">
                                    <SelectItem value="all" className="hover:cursor-pointer">All Status</SelectItem>
                                    <SelectItem value="PENDING" className="hover:cursor-pointer">Pending</SelectItem>
                                    <SelectItem value="ACCEPTED" className="hover:cursor-pointer">Accepted</SelectItem>
                                    <SelectItem value="COMPLETED" className="hover:cursor-pointer">Completed</SelectItem>
                                    <SelectItem value="REJECTED" className="hover:cursor-pointer">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-amber-700">
                                <TableRow className="hover:bg-amber-800">
                                    <TableHead className="text-white">Order Number</TableHead>
                                    <TableHead className="text-white">Customer</TableHead>
                                    <TableHead className="text-white">Start Date</TableHead>
                                    <TableHead className="text-white">End Date</TableHead>
                                    <TableHead className="text-white">Total</TableHead>
                                    <TableHead className="text-white">Status</TableHead>
                                    <TableHead className="text-right text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredOrders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-bold">{order.orderNumber}</TableCell>
                                        <TableCell className="font-semibold">{order.user.name}</TableCell>
                                        {/* <TableCell>{order.car.name}</TableCell> */}
                                        <TableCell className="font-semibold">{order.startDate ? new Date(order.startDate).toLocaleDateString() : "-"}</TableCell>
                                        <TableCell className="font-semibold">{order.endDate ? new Date(order.endDate).toLocaleDateString() : "-"}</TableCell>
                                        <TableCell className="font-semibold">{order.totalPrice ?? 0} TND</TableCell>
                                        <TableCell >
                                            <Badge
                                                variant="outline"
                                                className={getStatusBadgeClass(order.status)}
                                            >
                                                {formatStatusText(order.status)}
                                            </Badge>
                                        </TableCell>

                                        {/* <TableCell className="text-right">
                                            <Button size="sm" variant="ghost"
                                                className="hover:cursor-pointer">
                                                <EllipsisVertical />
                                            </Button>
                                        </TableCell> */}

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost" className="hover:cursor-pointer">
                                                        <EllipsisVertical />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end" className="w-32">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            const originalOrder = orders.find(o => o.id === order.id)
                                                            if (originalOrder) {
                                                                setSelectedOrder(originalOrder)
                                                                setOpenDialog(true)
                                                            }
                                                        }}
                                                        className="hover:cursor-pointer"
                                                    >
                                                        <Eye size={24} />  View
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        className="text-red-600 hover:text-red-600 hover:cursor-pointer"
                                                        onClick={async () => {
                                                            try {
                                                                await removeOrder(order.id);
                                                                toast.success("Order removed successfully");
                                                                setOpenDialog(false);
                                                            } catch (error) {
                                                                toast.error("Failed to remove order");
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 />  Remove
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>

            <Dialog open={openDialog}
                onOpenChange={setOpenDialog}

            >
                <DialogContent className="max-w-3xl bg-black/50 border-white/20 backdrop-blur-md">
                    <DialogHeader>
                        <DialogTitle className="text-primary/80">Order Details :</DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">

                            {/* ================= USER ================= */}
                            <div className="space-y-4 rounded-lg border border-white/20 p-4">
                                <Label className="text-base text-white font-semibold">Customer Information</Label>
                                <Separator className="border-white/20" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-gray-300 mb-1">Name:</Label>
                                        <p className="text-white">{selectedOrder.user.name}</p>
                                    </div>

                                    <div>
                                        <Label className="text-gray-300 mb-1">Email:</Label>
                                        <p className="text-white">{selectedOrder.user.email ?? "-"}</p>
                                    </div>

                                    <div>
                                        <Label className="text-gray-300 mb-1">Phone Number:</Label>
                                        <p className="text-white">{selectedOrder.user.profile?.phoneNumber ?? "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <Label className="text-gray-300 mb-1">Street Address:</Label>
                                        <p className="text-white">{selectedOrder.user.profile?.streetAddress ?? "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ================= ORDER ================= */}
                            <div className="space-y-4 rounded-lg border border-white/20 p-4">
                                <Label className="text-base font-semibold text-white">Order Information</Label>
                                <Separator className="border-white/20" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="">
                                        <Label className="text-gray-300 mb-1">Order Number:</Label>
                                        <p className="font-medium text-white">{selectedOrder.orderNumber}</p>
                                    </div>

                                    <div>
                                        <Label className="text-gray-300 mb-1">Status New</Label>
                                        <p className="text-white font-medium">{selectedOrder.status}</p>
                                    </div>

                                    <div>
                                        <Label className="text-gray-300 mb-1">Status:</Label>
                                        <Select
                                            value={selectedOrder.status}
                                            onValueChange={async (value) => {
                                                try {
                                                    await updateOrderStatus(
                                                        selectedOrder.id,
                                                        value as RentalStatus
                                                    );

                                                    setSelectedOrder({
                                                        ...selectedOrder,
                                                        status: value as RentalStatus,
                                                    });

                                                    toast.success("Order status updated successfully");
                                                } catch (error: any) {
                                                    toast.error("Failed to update order status");
                                                }
                                            }}
                                        >
                                            <SelectTrigger className=" w-full bg-primary/20 border-primary/20 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="text-gray-300 mb-1">Payment Status:</Label>
                                        <Select
                                            value={selectedOrder.paymentStatus}
                                            onValueChange={async (value) => {
                                                try {
                                                    await updatePaymentStatus(
                                                        selectedOrder.id,
                                                        value as PaymentStatus
                                                    );

                                                    setSelectedOrder({
                                                        ...selectedOrder,
                                                        paymentStatus: value as PaymentStatus,
                                                    });

                                                    toast.success("Payment status updated successfully");
                                                } catch (error) {
                                                    toast.error("Failed to update payment status");
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-full bg-primary/20 border-primary/20 text-white">
                                                <SelectValue />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="NOT_PAID">Not Paid</SelectItem>
                                                <SelectItem value="PAID">Paid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="text-gray-300 mb-1">Start Date :</Label>
                                        <p className="font-medium text-white">
                                            {new Date(selectedOrder.startDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <Label className="text-gray-300 mb-1">End Date :</Label>
                                        <p className="font-medium text-white">
                                            {new Date(selectedOrder.endDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <Label className="text-gray-300 mb-1">Total Days :</Label>
                                        <p className="font-medium text-white">
                                            {selectedOrder.totalDays}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ================= CAR & TOTAL ================= */}
                            <div className="space-y-4 rounded-lg border border-white/20 p-4">
                                <Label className="text-base font-semibold text-gray-300">Car & Pricing</Label>
                                <Separator className="border-white/20" />

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-gray-300 mb-1">Car:</Label>
                                        <p className="font-medium text-white">
                                            {selectedOrder.car?.name ??
                                                selectedOrder.orderCars?.[0]?.car?.name ??
                                                "Unknown"}
                                        </p>
                                    </div>

                                    <div>
                                        <Label className="text-gray-300 mb-1">Total Days:</Label>
                                        <p className="font-medium text-white">{selectedOrder.totalDays} days</p>
                                    </div>

                                    <div>
                                        <Label className="text-gray-300 mb-1">Total Price:</Label>
                                        <p className="text-lg font-bold text-primary">
                                            {selectedOrder.totalPrice} TND
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    )
}
