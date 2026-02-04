/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, SetStateAction } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, ChevronLeft, ChevronRight, ExternalLink, Search } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AdminHeader } from "@/components/dashboard/admin-header"
import { getAllCarsWithCompanyDetails } from "@/actions/dashboard/cars"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

const ITEMS_PER_PAGE = 8

export default function AdminVehiclesPage() {
    const [cars, setCars] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"ALL" | string>("ALL")
    const [currentPage, setCurrentPage] = useState(1)

    // Fetch cars on mount
    useEffect(() => {
        getAllCarsWithCompanyDetails().then(setCars)
    }, [])

    // Filtered cars by search & status
    const filteredCars = cars.filter((car) => {
        const search = searchQuery.toLowerCase()
        const matchesSearch =
            car.name?.toLowerCase().includes(search) ||
            car.company?.name?.toLowerCase().includes(search)
        const matchesStatus = statusFilter === "ALL" || car.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // Pagination
    const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedCars = filteredCars.slice(startIndex, endIndex)

    // Reset page if needed
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1)
    }, [totalPages, currentPage])

    return (
        <div className="flex flex-col flex-1">
            <AdminHeader title="Fleet Directory" description="Monitor all vehicles registered across the system" />

            <main className="flex-1 p-6 space-y-6">
                {/* SEARCH + FILTER */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 relative max-w-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary" />
                        <Input
                            placeholder="Search by name or company"
                            className="pl-9 h-10 bg-slate-800 border-slate-700"
                            value={searchQuery}
                            onChange={(e: { target: { value: SetStateAction<string> } }) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                        />
                    </div>

                    <Select
                        value={statusFilter}
                        onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1) }}
                    >
                        <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border border-slate-700 shadow-xl">
                            <SelectGroup>
                                <SelectItem value="ALL" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">All</SelectItem>
                                <SelectItem value="AVAILABLE" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Available</SelectItem>
                                <SelectItem value="RENTED" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Rented</SelectItem>
                                <SelectItem value="MAINTENANCE" className="text-white hover:text-black hover:bg-amber-500/10 hover:cursor-pointer">Maintenance</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* TABLE */}
                <Card className="bg-slate-800 border-slate-700 text-white">
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-slate-700">
                                <TableRow className="hover:bg-slate-800">
                                    <TableHead className="text-gray-400">Vehicle</TableHead>
                                    <TableHead className="text-gray-400">Owner Company</TableHead>
                                    <TableHead className="text-gray-400">Type</TableHead>
                                    <TableHead className="text-gray-400">Last Activity</TableHead>
                                    <TableHead className="text-gray-400">Health</TableHead>
                                    <TableHead className="text-right text-gray-400">Details</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paginatedCars.map((car) => {
                                    const health = Math.floor(Math.random() * 40) + 60
                                    return (
                                        <TableRow key={car.id} className="hover:bg-accent/10 group transition-colors">
                                            <TableCell className="flex items-center gap-3 py-4">
                                                <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
                                                    {car.imageUrl ? (
                                                        <Image
                                                            src={car.imageUrl}
                                                            alt={car.name}
                                                            width={36}
                                                            height={36}
                                                            className="object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <Car className="h-5 w-5 text-muted-foreground" />
                                                    )}                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{car.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">Year: {car.year}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-sm font-semibold hover:text-fuchsia-600 duration-500 underline hover:underline-offset-4 hover:cursor-pointer">
                                                <Link href={`/dashboard/companies/${car.company?.id}`}>
                                                    {car.company?.name ?? "—"}
                                                </Link>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="secondary">{car.category?.name ?? "N/A"}</Badge>
                                            </TableCell>

                                            <TableCell className="text-xs text-muted-foreground">Recently</TableCell>

                                            <TableCell>
                                                <div className="flex flex-col gap-1 w-24">
                                                    <div className="flex justify-between text-[10px]">
                                                        <span>Battery/Fuel</span>
                                                        <span>{health}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full",
                                                                health > 80 ? "bg-emerald-500" : health > 50 ? "bg-amber-500" : "bg-rose-500"
                                                            )}
                                                            style={{ width: `${health}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon"
                                                    className="h-8 w-8 rounded-full opacity-0 hover:bg-slate-700 hover:text-white group-hover:translate-x-1.5 group-hover:-translate-y-1.5 group-hover:opacity-100 duration-500">
                                                    <Link href={`/dashboard/companies/${car.company?.id}`}>
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}

                                {paginatedCars.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No cars found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* PAGINATION */}
                        {filteredCars.length > 0 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredCars.length)} of {filteredCars.length} cars
                                </p>

                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft />
                                    </Button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
                                        >
                                            {page}
                                        </Button>
                                    ))}

                                    <Button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div >
    )
}
