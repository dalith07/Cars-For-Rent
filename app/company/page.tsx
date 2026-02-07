"use client";

import { useEffect, useState } from "react";
import { CompanyHeader } from "@/components/company/company-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Car, Users, DollarSign, Search } from "lucide-react";
import AnimatedCounter from "@/components/ui/animated-counter";
import { getCompanyDashboardData } from "@/actions/company/cars";
import { cn } from "@/lib/utils";

type DashboardStats = {
    totalCars: number;
    availableCars: number;
    activeRentals: number;
    totalRevenue: number;
};

type DashboardOrder = {
    id: string;
    customer: string;
    car: string;
    period: string;
    price: number;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED";
};

export default function CompanyDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalCars: 0,
        availableCars: 0,
        activeRentals: 0,
        totalRevenue: 0,
    });

    const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        getCompanyDashboardData().then((data) => {
            setStats({
                totalCars: data.stats.totalCars,
                availableCars: data.stats.availableCars,
                activeRentals: data.stats.activeRentals,
                totalRevenue: data.stats.totalRevenue,
            });

            const mappedOrders: DashboardOrder[] = data.recentOrders.map(
                (order) => ({
                    id: order.id,
                    customer: order.user?.name ?? "Unknown",
                    car: order.car?.name ?? order.orderNumber,
                    period: `${new Date(order.startDate).toLocaleDateString()} - ${new Date(
                        order.endDate
                    ).toLocaleDateString()}`,
                    price: order.totalPrice,
                    status: order.status,
                })
            );

            setRecentOrders(mappedOrders);
        });
    }, []);

    const filteredOrders = recentOrders.filter((order) => {
        const matchesSearch =
            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.car.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const dashboardStats = [
        {
            title: "Total Cars",
            value: stats.totalCars,
            icon: Car,
            description: "All company cars",
            iconColor: "text-purple-400",
        },
        {
            title: "Available Cars",
            value: stats.availableCars,
            icon: Car,
            description: "Ready to rent",
            iconColor: "text-emerald-400",
        },
        {
            title: "Active Rentals",
            value: stats.activeRentals,
            icon: Users,
            description: "Currently rented",
            iconColor: "text-blue-400",
        },
        {
            title: "Total Revenue",
            value: stats.totalRevenue,
            icon: DollarSign,
            description: "Completed rentals",
            iconColor: "text-amber-400",
        },
    ];


    return (
        <div className="flex flex-1 flex-col">
            <CompanyHeader
                title="Company Dashboard"
                description="Overview of your rental business"
            />

            <main className="flex flex-1 flex-col gap-6 p-6">
                {/* STATS */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {dashboardStats.map((stat) => (
                        <Card key={stat.title} className="bg-emerald-800 border-emerald-700 text-accent hover:bg-emerald-900 hover:cursor-pointer duration-500 group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-100">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon size={24} className={cn("group-hover:scale-125 duration-500", stat.iconColor)}
                                />
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold text-accent">
                                    <AnimatedCounter value={stat.value} />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* ORDERS */}
                <Card className="bg-emerald-800 text-white">
                    <CardHeader>
                        <CardTitle className="text-gray-400">Recent Orders :</CardTitle>

                        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search by customer or car..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-emerald-900 border-emerald-700/70 text-white placeholder:text-white/70 focus:ring-2 focus:ring-amber-600"
                                />
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-full sm:w-[180px] bg-emerald-900 border-emerald-700/70">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent className="bg-emerald-900 border-emerald-700/70 text-white">
                                    <SelectItem value="all" className="hover:cursor-pointer">All</SelectItem>
                                    <SelectItem value="PENDING" className="hover:cursor-pointer">Pending</SelectItem>
                                    <SelectItem value="ACCEPTED" className="hover:cursor-pointer">Accepted</SelectItem>
                                    <SelectItem value="COMPLETED" className="hover:cursor-pointer">Completed</SelectItem>
                                    <SelectItem value="REJECTED" className="hover:cursor-pointer">Rejected</SelectItem>
                                    <SelectItem value="CANCELLED" className="hover:cursor-pointer">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-emerald-700">
                                <TableRow className="hover:bg-emerald-800">
                                    <TableHead className="text-white">Customer</TableHead>
                                    <TableHead className="text-white">Car</TableHead>
                                    <TableHead className="text-white">Period</TableHead>
                                    <TableHead className="text-white">Price</TableHead>
                                    <TableHead className="text-white">Status</TableHead>
                                    <TableHead className="text-right text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            {order.customer}
                                        </TableCell>
                                        <TableCell>{order.car}</TableCell>
                                        <TableCell>{order.period}</TableCell>
                                        <TableCell>{order.price} DT</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    order.status === "COMPLETED"
                                                        ? "default"
                                                        : order.status === "ACCEPTED"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {order.status === "PENDING" && (
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm">Accept</Button>
                                                    <Button size="sm" variant="outline">
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
