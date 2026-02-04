/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useRef, useLayoutEffect, useEffect } from "react"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
    Search, Trash2, ChevronLeft, ChevronRight,
    EllipsisVertical, Eye,
    Loader2,
} from "lucide-react"
import gsap from "gsap"
import { UserRole, UserStatus } from "@prisma/client"
import Link from "next/link"
import { deleteUserById, updateUserRoleAndStatus } from "@/data/user"
import {
    Select, SelectTrigger, SelectValue,
    SelectContent, SelectGroup, SelectItem
} from "@/components/ui/select"
import { AdminHeader } from "../dashboard/admin-header"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { UserWithCompany } from "@/lib/utils"
import { PasswordViewer } from "../PasswordViewer"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

/* ================= CONSTANT ================= */
const ITEMS_PER_PAGE = 8


interface UsersPageProps {
    usersItems: UserWithCompany[]
}

/* ================= ROLE FORMAT ================= */
function formatUserRole(role: UserRole) {
    switch (role) {
        case UserRole.COMPANY_OWNER:
            return "Company User"
        case UserRole.ADMIN:
            return "Admin"
        case UserRole.USER:
        default:
            return "User"
    }
}

/* ================= COMPONENT ================= */
export default function UsersPage({ usersItems }: UsersPageProps) {

    const tableRef = useRef<HTMLDivElement | null>(null)

    const [users, setUsers] = useState<UserWithCompany[]>(usersItems)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL")
    const [currentPage, setCurrentPage] = useState(1)
    const [openActionId, setOpenActionId] = useState<string | null>(null)

    const [selectedUser, setSelectedUser] = useState<UserWithCompany | null>(null)

    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    const handleSaveChanges = async () => {
        if (!selectedUser) return

        setIsSaving(true)
        setSaveError(null)

        const res = await updateUserRoleAndStatus({
            userId: selectedUser.id,
            role: selectedUser.role,
            status: selectedUser.status,
        })

        setIsSaving(false)

        if (!res.success) {
            setSaveError(res.error || "Something went wrong")
            return
        }

        // Update local users list
        setUsers((prev) =>
            prev.map((u) =>
                u.id === selectedUser.id
                    ? { ...u, role: selectedUser.role, status: selectedUser.status }
                    : u
            )
        )

        setSelectedUser(null)
    }

    /* ================= Animation ================= */
    useLayoutEffect(() => {
        if (!tableRef.current) return

        const ctx = gsap.context(() => {
            gsap.fromTo(
                tableRef.current,
                { opacity: 0, y: 25 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    clearProps: "opacity,transform",
                }
            )
        })

        return () => ctx.revert()
    }, [])
    /* ================= Search + Filter ================= */
    const filteredUsers = users.filter((user) => {
        const search = searchQuery.toLowerCase()

        const matchesSearch =
            user.name?.toLowerCase().includes(search) ||
            user.email?.toLowerCase().includes(search)

        const matchesStatus =
            statusFilter === "ALL" || user.status === statusFilter

        return matchesSearch && matchesStatus
    })

    /* ================= Pagination ================= */
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    /* ================= Reset page if needed ================= */
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1)
        }
    }, [totalPages, currentPage])

    return (
        <div>
            <AdminHeader
                title="Users Management"
                description="Manage and view all registered users"
            />

            <main className="flex-1 p-6 space-y-6">

                {/* ================= SEARCH + FILTER ================= */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 w-full max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white" />
                            <Input
                                placeholder="Search by name or email"
                                className="pl-9 h-10 bg-slate-800 border-slate-700"

                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setCurrentPage(1)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") setCurrentPage(1)
                                }}
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 shrink-0 bg-slate-800 text-white border-slate-700"
                            onClick={() => setCurrentPage(1)}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    <Select
                        value={statusFilter}
                        onValueChange={(value) => {
                            setStatusFilter(value as UserStatus | "ALL")
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border border-slate-700 shadow-xl">
                            <SelectGroup>
                                <SelectItem value="ALL" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">All</SelectItem>
                                <SelectItem value="ACTIVE" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Active</SelectItem>
                                <SelectItem value="INACTIVE" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Inactive</SelectItem>
                                <SelectItem value="SUSPENDED" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Suspended</SelectItem>
                                <SelectItem value="BANNED" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Banned</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* ================= TABLE ================= */}
                <Card ref={tableRef} className="bg-slate-800 border-slate-700 text-white">
                    <CardHeader>
                        <CardTitle>User List</CardTitle>
                        <CardDescription>
                            Total users: {filteredUsers.length}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <CardContent className="overflow-x-auto">
                            <Table >
                                <TableHeader className="bg-slate-700">
                                    <TableRow className="hover:bg-slate-800">
                                        <TableHead className="text-gray-400">Name</TableHead>
                                        <TableHead className="text-gray-400">Email</TableHead>
                                        <TableHead className="text-gray-400">Role</TableHead>
                                        <TableHead className="text-gray-400">Status</TableHead>
                                        <TableHead className="text-gray-400">Joined</TableHead>
                                        <TableHead className="text-center text-gray-400">Action</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {paginatedUsers.length > 0 ? (
                                        paginatedUsers.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-accent/10 group transition-colors">
                                                {/* NAME + COMPANY */}
                                                <TableCell className="px-4 py-3">
                                                    <div className="font-medium text-sm">
                                                        {user.name || "Unknown"}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                                                    {user.email}
                                                </TableCell>

                                                {/* ROLE */}
                                                <TableCell className="px-4 py-3 text-sm font-semibold relative">
                                                    {user.role === "COMPANY_OWNER" && user.company ? (
                                                        <Link
                                                            href={`/dashboard/companies/${user.company.id}`}
                                                            className="hover:underline text-fuchsia-600"
                                                            onClick={(e) => e.stopPropagation()} // important if row click exists
                                                        >
                                                            {formatUserRole(user.role)}
                                                        </Link>
                                                    ) : (
                                                        <span>{formatUserRole(user.role)}</span>
                                                    )}
                                                </TableCell>

                                                {/* STATUS */}
                                                <TableCell className="px-4 py-3">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium
                                                            ${user.status === "ACTIVE" && "bg-green-500/20 text-green-700"}
                                                            ${user.status === "INACTIVE" && "bg-gray-500/20 text-gray-700"}
                                                            ${user.status === "SUSPENDED" && "bg-yellow-500/20 text-yellow-700"}
                                                            ${user.status === "BANNED" && "bg-red-500/20 text-red-700"}`}
                                                    >
                                                        {user.status}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-muted-foreground">
                                                    {new Date(user.createdAt).toISOString().split("T")[0]}
                                                </TableCell>

                                                {/* ACTION */}
                                                <TableCell className="px-4 py-3 text-center relative">
                                                    <button
                                                        onClick={() =>
                                                            setOpenActionId(
                                                                openActionId === user.id ? null : user.id
                                                            )
                                                        }
                                                        className="p-2 hover:cursor-pointer hover:bg-slate-700 rounded"
                                                    >
                                                        <EllipsisVertical />
                                                    </button>

                                                    {openActionId === user.id && (
                                                        <div className="absolute right-18 -top-8 bg-slate-800 border border-slate-600 rounded shadow z-50 min-w-[150px]">
                                                            {/* <Link href={`/dashboard/users/${user.id}`}>
                                                                <button
                                                                    onClick={() => setSelectedUser(user)}
                                                                    className="w-full hover:cursor-pointer px-4 py-2 flex items-center gap-2 hover:bg-muted">
                                                                    <Eye size={16} /> View
                                                                </button>
                                                            </Link> */}
                                                            <button
                                                                onClick={() => setSelectedUser(user)}
                                                                className="w-full hover:cursor-pointer px-4 py-2 flex items-center gap-2 hover:bg-slate-700">
                                                                <Eye size={16} /> View
                                                            </button>

                                                            <button
                                                                onClick={async () => {
                                                                    await deleteUserById(user.id)
                                                                }}
                                                                className="w-full px-4 py-2 hover:cursor-pointer flex items-center gap-2 text-red-600 hover:bg-red-500/20"
                                                            >
                                                                <Trash2 size={16} /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-8 text-center text-muted-foreground"
                                            >
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>

                        {selectedUser && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center
                                    bg-gray-900/70 backdrop-blur-sm"
                                onClick={() => setSelectedUser(null)}
                            >
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-background w-full max-w-lg rounded-2xl
                                    shadow-2xl border border-border p-6
                                    animate-in fade-in zoom-in-95"
                                >
                                    {/* HEADER */}
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold">User Details</h2>
                                        <button
                                            onClick={() => setSelectedUser(null)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* BODY */}
                                    <div className="space-y-4 text-sm">
                                        <Info label="Name" value={selectedUser.name} />
                                        <Info label="Email" value={selectedUser.email} />

                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Password (hashed)</span>
                                            <PasswordViewer passwordHash={selectedUser.password} />
                                        </div>

                                        {/* ROLE */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Role</span>
                                            <Select
                                                value={selectedUser.role}
                                                onValueChange={(val) =>
                                                    setSelectedUser({ ...selectedUser, role: val as UserRole })
                                                }
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="USER">User</SelectItem>
                                                    <SelectItem value="COMPANY_OWNER">Company Owner</SelectItem>
                                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* STATUS */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Status</span>
                                            <Select
                                                value={selectedUser.status}
                                                onValueChange={(val) =>
                                                    setSelectedUser({ ...selectedUser, status: val as UserStatus })
                                                }
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                                    <SelectItem value="BANNED">Banned</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Info
                                            label="Joined"
                                            value={new Date(selectedUser.createdAt).toLocaleDateString()}
                                        />

                                        {selectedUser.company && (
                                            <Info label="Company" value={selectedUser.company.name} />
                                        )}

                                        {saveError && (
                                            <p className="text-sm text-red-500 mt-2">{saveError}</p>
                                        )}
                                    </div>

                                    {/* FOOTER */}
                                    <div className="mt-6 flex justify-between">
                                        <Button variant="outline">Reset Password</Button>
                                        <div className="flex gap-2">
                                            <Button variant="outline"
                                                onClick={() => setSelectedUser(null)}>
                                                Close
                                            </Button>

                                            <Button onClick={handleSaveChanges} disabled={isSaving} className="hover:cursor-pointer">
                                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Save changes
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* ================= PAGINATION ================= */}
                        {filteredUsers.length > 0 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1} to{" "}
                                    {Math.min(endIndex, filteredUsers.length)} of{" "}
                                    {filteredUsers.length} users
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((p) => Math.max(1, p - 1))
                                        }
                                        className="p-2 hover:bg-muted rounded disabled:opacity-50"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                            (page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-8 h-8 rounded
                            ${currentPage === page
                                                            ? "bg-primary text-primary-foreground"
                                                            : "hover:bg-muted"
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        )}
                                    </div>

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(totalPages, p + 1)
                                            )
                                        }
                                        className="p-2 hover:bg-muted rounded disabled:opacity-50"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}


function Info({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">
                {value ?? "—"}
            </span>
        </div>
    )
}