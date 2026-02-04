import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Building2,
    Car,
    TrendingUp,
    Users,
    ArrowDownRight,
    Search,
    SlidersHorizontal,
    ChevronRight,
    Mail,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/dashboard/admin-header"
import {
    getAdminUsers,
    getTotalUsers,
    getUsersWithCompany,
    getNormalUsers,
} from "@/actions/dashboard/users"

import AnimatedCounter from "@/components/ui/animated-counter"
import { getActiveCompanies, getAllCompaniesWithUsers, getBlockedCompanies, getPendingCompanies, getRejectedCompanies, getTotalCompanies } from "@/actions/dashboard/company/company"
import { getCarsGrowthFromLastWeek, getTotalCars } from "@/actions/dashboard/cars"
import { CompanyStatus } from "@prisma/client"
import Image from "next/image"
import { CompanyActions } from "@/components/company-actions"
import Link from "next/link"

export default async function AdminDashboard() {

    const totalUsers = await getTotalUsers()
    const usersWithCompany = await getUsersWithCompany()
    const normalUsers = await getNormalUsers()
    const adminUsers = await getAdminUsers()

    const [
        totalCompanies,
        activeCompanies,
        pendingCompanies,
        rejectedCompanies,
        blockedCompanies,
    ] = await Promise.all([
        getTotalCompanies(),
        getActiveCompanies(),
        getPendingCompanies(),
        getRejectedCompanies(),
        getBlockedCompanies(),
    ])

    const totalCars = await getTotalCars();

    const carGrowth = await getCarsGrowthFromLastWeek();

    const companies = await getAllCompaniesWithUsers();

    const companyStatusLabel: Record<CompanyStatus, string> = {
        PENDING: "Pending",
        APPROVED: "Approved",
        REJECTED: "Rejected",
        BLOCKED: "Blocked",
    };

    const companyStatusStyles: Record<CompanyStatus, string> = {
        PENDING: "bg-amber-500/20 text-amber-400",
        APPROVED: "bg-emerald-500/20 text-emerald-400",
        REJECTED: "bg-rose-500/20 text-rose-400",
        BLOCKED: "bg-zinc-500/20 text-zinc-400",
    };

    return (
        <div className="flex flex-col flex-1">
            <AdminHeader title="System Overview" description="Global platform performance and company statistics" />

            <main className="flex-1 p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none shadow-sm  bg-slate-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle>Total Companies</CardTitle>

                            <div className="p-2 bg-fuchsia-600/10 rounded-lg">
                                <Building2 className="h-4 w-4 text-fuchsia-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <div className="text-2xl font-bold">
                                <AnimatedCounter value={totalCompanies} />
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Active: <AnimatedCounter value={activeCompanies} />
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Pending: <AnimatedCounter value={pendingCompanies} />
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Rejected: <AnimatedCounter value={rejectedCompanies} />
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Blocked: <AnimatedCounter value={blockedCompanies} />
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-slate-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">
                                Active Vehicles
                            </CardTitle>
                            <div className="p-2 bg-green-600/10 rounded-lg">
                                <Car className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold tracking-tight">
                                <AnimatedCounter value={totalCars} />
                            </div>

                            <p
                                className={cn(
                                    "text-xs flex items-center gap-1 mt-1 font-medium",
                                    carGrowth.isUp ? "text-emerald-600" : "text-rose-600"
                                )}
                            >
                                {carGrowth.isUp ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3" />
                                )}
                                {Math.abs(carGrowth.percent)}% from last week
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-slate-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">
                                System Users
                            </CardTitle>
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Users className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-1">
                            <div className="text-2xl font-bold tracking-tight">
                                <AnimatedCounter value={totalUsers} />
                            </div>

                            <p className="text-xs text-muted-foreground">
                                🏢 Company users: <span className="font-medium"><AnimatedCounter value={usersWithCompany} /></span>
                            </p>

                            <p className="text-xs text-muted-foreground">
                                👤 Normal users: <span className="font-medium"><AnimatedCounter value={normalUsers} /></span>
                            </p>

                            <p className="text-xs text-muted-foreground">
                                👑 Admins: <span className="font-medium"><AnimatedCounter value={adminUsers} /></span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-slate-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium ">Platform Revenue</CardTitle>
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <TrendingUp className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tight">$450,200</div>
                            <p className="text-xs flex items-center gap-1 mt-1 text-emerald-600 font-medium">
                                <TrendingUp className="h-3 w-3" /> +18.4% since Q3
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-1 items-center gap-2 max-w-md w-full">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white" />
                            <Input placeholder="Search companies..." className="pl-9 bg-slate-800 text-white h-10 border-none shadow-sm" />
                        </div>
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-slate-800 hover:cursor-pointer hover:bg-slate-700 duration-500 border-none shadow-sm">
                            <SlidersHorizontal className="h-4 w-4 text-white hover:text-white" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-full sm:w-[150px] bg-slate-800 hover:cursor-pointer border-none shadow-sm h-10">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border border-slate-700 shadow-xl">
                                <SelectItem value="all" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">All Status</SelectItem>
                                <SelectItem value="active" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Active</SelectItem>
                                <SelectItem value="pending" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Pending</SelectItem>
                                <SelectItem value="suspended" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                        {/* <Button className="h-10 px-4 bg-slate-800 hover:cursor-pointer hover:text-primary text-white shadow-md hover:bg-slate-800/90 duration-500">
                            <Plus className="mr-2 h-4 w-4" /> Add Company
                        </Button> */}
                    </div>
                </div>

                {/* Company Table */}
                <Card className="border-none shadow-sm overflow-hidden bg-slate-800 text-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold">Recent Company Partners</CardTitle>
                            <CardDescription className="text-gray-400">A list of the latest companies registered on the platform</CardDescription>
                        </div>
                        <Link href={"/dashboard/companies"} className="group">
                            <Button variant="ghost" size="sm" className="hover:cursor-pointer text-primary hover:text-primary hover:bg-primary/5">
                                View All <ChevronRight className="ml-1 h-4 w-4 group-hover:scale-110 duration-500 group-hover:translate-x-1.5" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-700 ">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[250px] pl-6 text-white">Company</TableHead>
                                    <TableHead className="text-white">Fleet Size</TableHead>
                                    <TableHead className="text-white">Status</TableHead>
                                    <TableHead className="text-white">Rating</TableHead>
                                    <TableHead className="text-white">Revenue Share</TableHead>
                                    <TableHead className="text-right text-white pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {companies.map((company) => (
                                    <TableRow
                                        key={company.id}
                                        className="group hover:bg-accent/20 transition-colors"
                                    >
                                        {/* Company */}
                                        <TableCell className="font-medium pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold text-xs">
                                                    {company.logo ? (
                                                        <Image
                                                            src={company.logo}
                                                            alt="logo company"
                                                            width={32}
                                                            height={32}
                                                            className="object-cover "
                                                        />
                                                    ) : (
                                                        <span className="uppercase">
                                                            {company.name?.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{company.name}</span>
                                                    <span className="text-[10px] flex items-center gap-1 text-gray-400">
                                                        <Mail size={13} className="text-primary" /> {company.email}
                                                    </span>
                                                    {/* <span className="text-[8px] text-gray-400">
                                                        Member since {new Date(company.createdAt).getFullYear()}
                                                    </span> */}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Fleet Size */}
                                        <TableCell >
                                            {company.totalCars} cars
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "rounded-full px-2 py-0 h-5 text-[10px] border-none font-medium",
                                                    companyStatusStyles[company.status]
                                                )}
                                            >
                                                {companyStatusLabel[company.status]}
                                            </Badge>
                                        </TableCell>

                                        {/* Rating (placeholder) */}
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-semibold">N/A</span>
                                            </div>
                                        </TableCell>

                                        {/* Revenue */}
                                        <TableCell className="font-mono text-xs">
                                            {company.totalOrders * 120} DT
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right pr-6">
                                            <CompanyActions
                                                companyId={company.id}
                                                companyName={company.name}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main >
        </div >
    )
}
