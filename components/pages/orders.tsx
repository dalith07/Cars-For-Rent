"use client"

import { MoreHorizontal, CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight, Search, Eye, Trash2, Phone, Mail, User, X } from "lucide-react"
import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderWithAll } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { updateOrder } from "@/actions/dashboard/orders"

interface OrdersPageProps {
    ordersItems: OrderWithAll[]
}

export default function OrdersPage({ ordersItems }: OrdersPageProps) {
    const [order, setOrder] = useState<OrderWithAll[]>(ordersItems)
    const [selectedOrder, setSelectedOrder] = useState<OrderWithAll | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [tempStatus, setTempStatus] = useState<string>("processing")
    const [tempIsPaid, setTempIsPaid] = useState<string>("Not Paid")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const ordersPerPage = 8

    const filteredOrders = order.filter((o) => {
        const orderStatus = o.status ?? "processing"

        const matchesSearch =
            o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customerName?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
            selectedStatus === "all" || orderStatus === selectedStatus

        return matchesSearch && matchesStatus
    })


    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
    const startIndex = (currentPage - 1) * ordersPerPage
    const endIndex = startIndex + ordersPerPage
    const orders = filteredOrders.slice(startIndex, endIndex)

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current.querySelectorAll(".order-row"),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }
            )
        }
    }, [currentPage])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedStatus])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "confirmed": return <CheckCircle className="w-4 h-4 text-green-500" />
            case "processing": return <Clock className="w-4 h-4 text-blue-500" />
            case "cancelled": return <XCircle className="w-4 h-4 text-red-500" />
            default: return null
        }
    }

    const getStatusClass = (status: string) => {
        switch (status) {
            case "confirmed": return "bg-green-50 text-green-700"
            case "processing": return "bg-blue-50 text-blue-700"
            case "cancelled": return "bg-red-50 text-red-700"
            default: return "bg-gray-50 text-gray-700"
        }
    }

    const handlePreviousPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1) }
    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1) }
    const handlePageClick = (page: number) => setCurrentPage(page)

    const handleViewOrder = (order: OrderWithAll) => {
        setSelectedOrder(order)
        setTempStatus(order.status || "processing")
        setTempIsPaid(order.isPaid || "Not Paid")
        setIsModalOpen(true)
    }
    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedOrder(null)
        setTempStatus("processing")
        setTempIsPaid("Not Paid")
    }

    // Type-safe helpers
    const getSafeStatus = (status: string | null | undefined): "confirmed" | "processing" | "cancelled" => {
        if (status === "confirmed" || status === "processing" || status === "cancelled") return status
        return "processing"
    }
    const getSafePayment = (isPaid: string | null | undefined): "Paid" | "Not Paid" => {
        if (isPaid === "Paid" || isPaid === "Not Paid") return isPaid
        return "Not Paid"
    }

    // SERVER function wrapper
    const handleUpdateOrder = async (
        orderId: string,
        status: string | null | undefined,
        isPaid: string | null | undefined
    ) => {
        try {
            const updatedOrder = await updateOrder(
                orderId,
                getSafeStatus(status),
                getSafePayment(isPaid)
            )
            setOrder((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)))
            setSelectedOrder(updatedOrder)
            return updatedOrder
        } catch (err) {
            console.error("❌ Failed to update order", err)
            throw err
        }
    }

    // Handle submit - update order and close modal
    const handleSubmit = async () => {
        if (!selectedOrder) return

        setIsSubmitting(true)
        try {
            await handleUpdateOrder(selectedOrder.id, tempStatus, tempIsPaid)
            handleCloseModal()
        } catch (err) {
            console.error("❌ Failed to submit order update", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div ref={containerRef} className="animate-fade-in flex h-screen bg-background">
            <main className="flex-1">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Orders</h1>
                    <p className="text-muted-foreground">Manage and track all customer orders</p>
                </div>

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by order ID or customer name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Orders</SelectItem>
                            <SelectItem value="confirmed">confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Orders Table */}
                <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? orders.map((order, index) => (
                                    <tr key={index} className="order-row border-b border-border hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-foreground">{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{order.customerName}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-foreground">
                                            {(order.total ?? 0).toLocaleString()} TND
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusClass(order.status || "processing")}`}>
                                                {getStatusIcon(order.status || "processing")}
                                                <span className="capitalize text-xs font-medium">{order.status || "processing"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                                        <Eye className="w-4 h-4 mr-2" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No orders found matching your filters
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {orders.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handlePreviousPage} disabled={currentPage === 1} className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button key={page} onClick={() => handlePageClick(page)} className={`w-10 h-10 rounded-lg border transition-colors ${currentPage === page ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>{page}</button>
                            ))}
                            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {isModalOpen && selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <h2 className="text-2xl font-bold text-foreground">Order Details</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Order Info */}
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                                        <p className="text-lg font-semibold text-foreground">{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                                        <p className="text-lg font-semibold text-foreground">
                                            {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Amount</p>
                                        <p className="text-lg font-semibold text-primary">
                                            {(selectedOrder.total ?? 0).toLocaleString()} TND
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                                        <Select
                                            value={tempIsPaid}
                                            onValueChange={setTempIsPaid}
                                        >
                                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Paid">Paid</SelectItem>
                                                <SelectItem value="Not Paid">Not Paid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-muted-foreground mb-2">Order Status</p>
                                        <Select
                                            value={tempStatus}
                                            onValueChange={setTempStatus}
                                        >
                                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                                <SelectItem value="processing">Processing</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Customer Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Customer Name</p>
                                                <p className="font-medium text-foreground">{selectedOrder.customerName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Email Address</p>
                                                <p className="font-medium text-foreground">{selectedOrder.customerEmail}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Phone Number</p>
                                                <p className="font-medium text-foreground">{selectedOrder.phoneNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-border flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleCloseModal}
                                    className="flex-1 hover:cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    Close
                                </Button>

                                <Button
                                    onClick={handleSubmit}
                                    className="flex-1 hover:cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    )
}
