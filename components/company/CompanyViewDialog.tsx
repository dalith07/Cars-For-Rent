"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"
import { CompanyStatus, UserRole } from "@prisma/client"
import { CompanyWithAll } from "@/lib/utils"

/* ===================== PROPS ===================== */
interface CompanyViewDialogProps {
    open: boolean
    onClose: () => void

    company: CompanyWithAll | null

    selectedStatus: CompanyStatus
    setSelectedStatus: (status: CompanyStatus) => void

    loading: boolean
    onSave: () => Promise<void>
}

/* ===================== COMPONENT ===================== */
export function CompanyViewDialog({
    open,
    onClose,
    company,
    selectedStatus,
    setSelectedStatus,
    loading,
    onSave,
}: CompanyViewDialogProps) {
    if (!company) return null

    /* -------- helpers -------- */
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
                return "text-red-400"
            case UserRole.COMPANY_OWNER:
                return "text-emerald-400"
            case UserRole.USER:
                return "text-blue-400"
            default:
                return "text-muted-foreground"
        }
    }

    const statusColorClass = (status: CompanyStatus) => {
        switch (status) {
            case CompanyStatus.APPROVED:
                return "bg-emerald-500/10 text-emerald-500"
            case CompanyStatus.PENDING:
                return "bg-amber-500/10 text-amber-500"
            case CompanyStatus.REJECTED:
                return "bg-red-500/10 text-red-500"
            case CompanyStatus.BLOCKED:
                return "bg-gray-500/10 text-gray-400"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl rounded-2xl bg-slate-800 border border-slate-600 text-white p-0 overflow-hidden">

                {/* ================= HEADER ================= */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-600">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                            {company.logo ? (
                                <Image
                                    src={company.logo}
                                    alt="Company Logo"
                                    width={64}
                                    height={64}
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-primary">
                                    {company.name.charAt(0)}
                                </span>
                            )}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold">{company.name}</h2>
                            <p className="text-sm text-gray-400">
                                Created {new Date(company.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <Badge className={statusColorClass(company.status)}>
                        {company.status}
                    </Badge>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="px-6 py-6 space-y-8">

                    {/* ---- Company Info ---- */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">
                            COMPANY INFORMATION
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <Input value={company.name} disabled className="border-slate-600" />
                            <Input value={company.email} disabled className="border-slate-600" />
                            <Input value={company.phone} disabled className="border-slate-600" />
                            <Input
                                value={`${company.city}, ${company.address}`}
                                disabled
                                className="border-slate-600"
                            />
                        </div>
                    </div>

                    {/* ---- Description ---- */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">
                            DESCRIPTION
                        </h3>

                        <Textarea
                            value={company.description ?? "No description provided"}
                            disabled
                            className="resize-none border-slate-600"
                        />
                    </div>

                    {/* ---- Owner ---- */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">
                            COMPANY OWNER
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                value={company.owner?.email ?? ""}
                                disabled
                                className="border-slate-600"
                            />

                            <div className="flex items-center px-3 h-10 rounded-md border border-slate-600 bg-slate-800">
                                <span className={roleColorClass(company.owner!.role)}>
                                    {formatRole(company.owner!.role)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ---- Status ---- */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">
                            COMPANY STATUS
                        </h3>

                        <Select
                            value={selectedStatus}
                            onValueChange={(value: CompanyStatus) => setSelectedStatus(value)}
                            disabled={loading}
                        >
                            <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                <span className={statusColorClass(selectedStatus)}>
                                    {selectedStatus}
                                </span>
                            </SelectTrigger>

                            <SelectContent className="bg-slate-900 border border-slate-700 shadow-xl">
                                <SelectItem
                                    value={CompanyStatus.PENDING}
                                    className="text-amber-400 hover:bg-amber-500/10"
                                >
                                    Pending
                                </SelectItem>

                                <SelectItem
                                    value={CompanyStatus.APPROVED}
                                    className="text-emerald-400 hover:bg-emerald-500/10"
                                >
                                    Approved
                                </SelectItem>

                                <SelectItem
                                    value={CompanyStatus.REJECTED}
                                    className="text-red-400 hover:bg-red-500/10"
                                >
                                    Rejected
                                </SelectItem>

                                <SelectItem
                                    value={CompanyStatus.BLOCKED}
                                    className="text-gray-400 hover:bg-gray-500/10"
                                >
                                    Blocked
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* ================= FOOTER ================= */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-600 bg-slate-700">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="bg-slate-800 border-slate-400 hover:bg-slate-700 hover:text-white"
                    >
                        Close
                    </Button>

                    <Button
                        disabled={loading}
                        onClick={onSave}
                        className="bg-primary/25 hover:bg-primary/20 text-white border border-primary/50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}
