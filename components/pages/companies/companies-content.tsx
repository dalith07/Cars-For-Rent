/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, Plus, MoreHorizontal, Globe, Mail, View, Eye, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { AdminHeader } from "@/components/dashboard/admin-header"
import { CompanyWithAll } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import Image from "next/image"
// import { unverifyCompany, verifyCompany } from "@/actions/dashboard/company/company"
import { toast } from "sonner"
// import { approveCompany, rejectedCompany } from "@/actions/dashboard/company/company"
import { CompanyStatus, UserRole } from "@prisma/client"
import { updateCompanyStatus } from "@/actions/dashboard/company/company"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { AnimatePresence, motion } from "framer-motion"
import { CompanyViewDialog } from "@/components/company/CompanyViewDialog"

interface CarItemsProps {
    company: CompanyWithAll[];
}

export default function CompaniesContent({ company }: CarItemsProps) {
    const [companies, setCompanies] = useState<CompanyWithAll[]>(company);
    const [showDetails, setShowDetails] = useState(false);

    const [selectedCompany, setSelectedCompany] = useState<CompanyWithAll | null>(null);
    // console.log(selectedCompany)

    const [actionLoading, setActionLoading] = useState(false);
    const [openView, setOpenView] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState<CompanyStatus>(
        selectedCompany?.status ?? "PENDING"
    );

    const handleStatusChange = async (status: CompanyStatus) => {
        if (!selectedCompany) return;

        setActionLoading(true);

        try {
            await updateCompanyStatus(selectedCompany.id, status);

            // ✅ تحديث companies
            setCompanies(prev =>
                prev.map(c =>
                    c.id === selectedCompany.id ? { ...c, status } : c
                )
            );

            // ✅ تحديث selectedCompany
            setSelectedCompany(prev =>
                prev ? { ...prev, status } : prev
            );

            toast.success(`Company status updated to ${status}`);
        } catch (err) {
            toast.error("Failed to update status");
        }

        setActionLoading(false);
    };

    // 🔊 Sounds
    const playSuccessSound = () => {
        const audio = new Audio("/sounds/sound_notify.mp3")
        audio.play().catch(() => { })
    }

    const playRemoveSound = () => {
        const audio = new Audio("/sounds/sound_notify.mp3")
        audio.play().catch(() => { })
    }


    const formatRole = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN:
                return "Admin"
            case UserRole.COMPANY_OWNER:
                return "Company Owner"
            case UserRole.USER:
                return "User"
            default:
                return role
        }
    }

    const roleColorClass = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN:
                return "text-red-500"
            case UserRole.COMPANY_OWNER:
                return "text-emerald-500"
            case UserRole.USER:
                return "text-blue-500"
            default:
                return "text-muted-foreground"
        }
    }

    const formatCompanyStatus = (status: CompanyStatus) => {
        switch (status) {
            case CompanyStatus.PENDING:
                return "Pending"
            case CompanyStatus.APPROVED:
                return "Approved"
            case CompanyStatus.REJECTED:
                return "Rejected"
            case CompanyStatus.BLOCKED:
                return "Blocked"
            default:
                return status
        }
    }

    const companyStatusClass = (status: CompanyStatus) => {
        switch (status) {
            case CompanyStatus.PENDING:
                return "text-amber-400"
            case CompanyStatus.APPROVED:
                return "text-emerald-400"
            case CompanyStatus.REJECTED:
                return "text-red-400"
            case CompanyStatus.BLOCKED:
                return "text-gray-400"
            default:
                return "text-muted-foreground"
        }
    }

    return (
        <div className="flex flex-col flex-1">
            <AdminHeader title="Companies Management" description="View and manage all registered vehicle rental companies" />

            <main className="flex-1 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-1 items-center gap-2 max-w-md w-full">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white" />
                            <Input placeholder="Search by name, ID, or location..." className="pl-9 bg-slate-800 border-slate-600 h-10" />
                        </div>
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 hover:cursor-pointer hover:text-primary hover:bg-slate-800 bg-slate-800 border-slate-600">
                            <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-full sm:w-[180px] bg-slate-800 border-slate-600 h-10">
                                <SelectValue placeholder="Industry" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border border-slate-700 shadow-xl">
                                <SelectItem value="all" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">All Industries</SelectItem>
                                <SelectItem value="rental" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Car Rental</SelectItem>
                                <SelectItem value="logistics" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Logistics</SelectItem>
                                <SelectItem value="ride" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Ride Sharing</SelectItem>
                            </SelectContent>
                        </Select>
                        {/* <Button className="h-10 px-4 bg-primary/20 duration-500 text-white hover:cursor-pointer hover:text-white hover:bg-primary/15 shadow-md">
                            <Plus className="mr-2 h-4 w-4" /> Register Company
                        </Button> */}
                    </div>
                </div>

                <Card className="border-none shadow-sm overflow-hidden bg-slate-800 text-white">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-accent/30">
                                <TableRow>
                                    <TableHead className="pl-6 text-white">Company Information</TableHead>
                                    <TableHead className="text-white">Location</TableHead>
                                    <TableHead className="text-white">Fleet</TableHead>
                                    <TableHead className="text-white">Status</TableHead>
                                    <TableHead className="text-right pr-6 text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {companies.length > 0 ? (
                                    companies.map((item) => (
                                        <TableRow key={item.id} className="group hover:bg-accent/10 transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {item.logo ? (
                                                            <Image
                                                                src={item.logo}
                                                                alt="logo company"
                                                                width={32}
                                                                height={32}
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <span className="uppercase">
                                                                {item.name?.charAt(0)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">{item.name}</span>
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Mail className="h-3 w-3 text-primary" /> {item.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-sm font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {item.city}, {item.address}
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-sm">
                                                {item.cars?.length || 0} vehicles
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    className={
                                                        item.status === "APPROVED"
                                                            ? "bg-emerald-500/10 text-emerald-600"
                                                            : item.status === "PENDING"
                                                                ? "bg-amber-500/10 text-amber-600"
                                                                : item.status === "REJECTED"
                                                                    ? "bg-red-500/10 text-red-600"
                                                                    : "bg-gray-500/10 text-gray-600"
                                                    }
                                                >
                                                    {item.status}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 bg-slate-700 text-white rounded-full
                                                            opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-36 bg-slate-800 border-none shadow-lg"
                                                    >
                                                        {/* VIEW */}
                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 text-white hover:bg-slate-700 cursor-pointer"
                                                            onClick={() => {
                                                                setSelectedCompany(item)
                                                                setSelectedStatus(item.status)
                                                                setOpenView(true)
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4 text-primary" />
                                                            View
                                                        </DropdownMenuItem>

                                                        {/* REMOVE (with AlertDialog) */}
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem
                                                                    className="flex items-center gap-2 text-rose-400 hover:bg-rose-500/10 cursor-pointer"

                                                                    onSelect={(e) => e.preventDefault()} // keep menu open
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    Remove
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>

                                                            <AlertDialogContent className="bg-slate-900 border-none">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-white">
                                                                        Remove company?
                                                                    </AlertDialogTitle>

                                                                    <AlertDialogDescription className="text-gray-400">
                                                                        Are you sure you want to remove{" "}
                                                                        <span className="font-semibold text-white">
                                                                            {item.name}
                                                                        </span>
                                                                        ? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>

                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600">
                                                                        Cancel
                                                                    </AlertDialogCancel>

                                                                    <AlertDialogAction
                                                                        className="bg-rose-600 hover:bg-rose-700 text-white"
                                                                        onClick={async () => {
                                                                            playRemoveSound()
                                                                            console.log("DELETE COMPANY:", item.id)

                                                                            // await deleteCompany(item.id)
                                                                            // setCompanies(prev => prev.filter(c => c.id !== item.id))

                                                                            toast.success("Company removed successfully")
                                                                        }}
                                                                    >
                                                                        Remove
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            No companies found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>

            <CompanyViewDialog
                open={openView}
                onClose={() => setOpenView(false)}
                company={selectedCompany}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                loading={actionLoading}
                onSave={async () => {
                    if (!selectedCompany) return

                    setActionLoading(true)
                    try {
                        await updateCompanyStatus(selectedCompany.id, selectedStatus)

                        setCompanies(prev =>
                            prev.map(c =>
                                c.id === selectedCompany.id
                                    ? { ...c, status: selectedStatus }
                                    : c
                            )
                        )

                        setSelectedCompany(prev =>
                            prev ? { ...prev, status: selectedStatus } : prev
                        )

                        toast.success("Company updated successfully")
                        setOpenView(false)
                    } catch {
                        toast.error("Failed to update company")
                    }

                    setActionLoading(false)
                }}
            />

        </div>
    )
}
