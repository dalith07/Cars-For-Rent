/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useRef, SetStateAction, useLayoutEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Trash2, ChevronLeft, ChevronRight, EllipsisVertical, Eye } from "lucide-react"
import gsap from "gsap"
import { User } from "@prisma/client"
import Header from "../dashboard/header"
import Link from "next/link"
import { deleteUserById } from "@/data/user"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "@/components/ui/select"


// const initialUsers = [
//     { id: 1, name: "John Doe", email: "john@example.com", status: "Active", joined: "2024-01-15" },
//     { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active", joined: "2024-02-20" },
//     { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Inactive", joined: "2024-01-10" },
//     { id: 4, name: "Alice Williams", email: "alice@example.com", status: "Active", joined: "2024-03-05" },
//     { id: 5, name: "Charlie Brown", email: "charlie@example.com", status: "Active", joined: "2024-02-28" },
//     { id: 6, name: "Diana Prince", email: "diana@example.com", status: "Active", joined: "2024-03-10" },
//     { id: 7, name: "Edward Norton", email: "edward@example.com", status: "Inactive", joined: "2024-01-20" },
//     { id: 8, name: "Fiona Green", email: "fiona@example.com", status: "Active", joined: "2024-02-15" },
//     { id: 9, name: "George Martin", email: "george@example.com", status: "Active", joined: "2024-03-01" },
//     { id: 10, name: "Hannah Lee", email: "hannah@example.com", status: "Active", joined: "2024-02-10" },
//     { id: 11, name: "Isaac Newton", email: "isaac@example.com", status: "Inactive", joined: "2024-01-25" },
//     { id: 12, name: "Julia Roberts", email: "julia@example.com", status: "Active", joined: "2024-03-08" },
// ]

const ITEMS_PER_PAGE = 8

interface UsersPageProps {
    usersItems: User[]; // optional
}

export default function UsersPage({ usersItems }: UsersPageProps) {
    const containerRef = useRef(null)

    const [user, setUser] = useState<User[]>(usersItems);

    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [openActionId, setOpenActionId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1)

    const [sidebarOpen, setSidebarOpen] = useState(true)
    // const [activePage, setActivePage] = useState("dashboard")
    const [showNotifications, setShowNotifications] = useState(false)

    const tableRef = useRef<HTMLDivElement | null>(null)

    useLayoutEffect(() => {
        if (!tableRef.current) return

        const ctx = gsap.context(() => {
            gsap.from(tableRef.current, {
                opacity: 0,
                y: 25,
                duration: 0.6,
                ease: "power2.out",
            })
        }, tableRef)

        return () => ctx.revert()
    }, [])

    const filteredUsers = user?.filter((user) => {
        const matchesSearch =
            (user.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.status.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "All" || user.status === statusFilter;

        return matchesSearch && matchesStatus;
    }) || [];

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    const handleSearch = (e: { target: { value: SetStateAction<string> } }) => {
        setSearchQuery(e.target.value)
        setCurrentPage(1)
    }

    return (
        <div ref={containerRef} className="animate-fade-in flex bg-background min-h-full">

            <div className="flex-1 flex flex-col">


                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Users</h1>
                    <p className="text-muted-foreground">Manage and view all registered users.</p>
                </div>

                <div className="mb-6 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, email"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-2/4 pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* ✅ Status Filter */}
                    <Select onValueChange={(value) => setStatusFilter(value)} value={statusFilter}>
                        <SelectTrigger className="w-[180px] rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent className="rounded-lg border border-border bg-background shadow-md">
                            <SelectGroup>
                                <SelectItem value="All" className="cursor-pointer">
                                    All
                                </SelectItem>

                                <SelectItem
                                    value="Active"
                                    className="cursor-pointer data-highlighted:bg-green-500/20"
                                >
                                    Active
                                </SelectItem>

                                <SelectItem
                                    value="Inactive"
                                    className="cursor-pointer data-highlighted:bg-gray-500/20"
                                >
                                    Inactive
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="animate-scale-in" ref={tableRef}>
                    <CardHeader>
                        <CardTitle>User List</CardTitle>
                        <CardDescription>Total users: {filteredUsers.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left px-4 py-3 font-semibold text-foreground">Name</th>
                                        <th className="text-left px-4 py-3 font-semibold text-foreground">Email</th>
                                        <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                                        <th className="text-left px-4 py-3 font-semibold text-foreground">Joined</th>
                                        <th className="text-center px-4 py-3 font-semibold text-foreground">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.length > 0 ? (
                                        paginatedUsers.map((user) => (
                                            <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                                <td className="px-4 py-3 text-foreground">{user.name}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === "Active"
                                                            ? "bg-green-500/20 text-green-700"
                                                            : "bg-gray-500/20 text-gray-700"
                                                            }`}
                                                    >
                                                        {user.status}
                                                    </span>
                                                </td>
                                                {/* <td className="px-4 py-3 text-muted-foreground">{user.joined}</td> */}
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : "-"}
                                                </td>
                                                <td className="px-4 py-3 text-center relative">
                                                    <button
                                                        onClick={() => setOpenActionId(openActionId === user.id ? null : user.id)}
                                                        className="p-2 hover:bg-muted rounded group hover:cursor-pointer transition-colors inline-block">
                                                        <EllipsisVertical className="group-hover:scale-125 duration-300 group-hover:text-yellow-500" size={20} />
                                                    </button>

                                                    {openActionId === user.id && (
                                                        <div className="absolute right-20 -top-8 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 min-w-[150px] animate-scale-in">
                                                            <Link href={`/dashboard/users/${user.id}`}>
                                                                <button
                                                                    className="w-full hover:cursor-pointer text-left group px-4 py-2 hover:bg-muted transition-colors text-sm text-foreground flex items-center gap-2 border-b border-border">
                                                                    <Eye className="w-4 h-4 group-hover:animate-ping" />
                                                                    view
                                                                </button>
                                                            </Link>
                                                            <button
                                                                className="w-full hover:cursor-pointer text-left group px-4 py-2 hover:bg-red-500/20 transition-colors text-sm text-red-600 flex items-center gap-2"
                                                                onClick={async () => await deleteUserById(user.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4 group-hover:animate-ping" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                No users found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length > 0 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-foreground" />
                                    </button>
                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                className={`w-8 h-8 rounded transition-colors ${currentPage === page
                                                    ? "bg-primary text-primary-foreground font-semibold"
                                                    : "hover:bg-muted text-foreground"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        disabled={currentPage === totalPages}
                                        className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-5 h-5 text-foreground" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>


        </div>
    )
}
