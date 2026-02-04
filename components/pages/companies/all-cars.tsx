/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ExternalLink, Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { CompanyHeader } from "@/components/company/company-header"
import Link from "next/link"
import { ItemsCarsWithAlll } from "@/lib/utils"
import { CARS_PER_PAGE } from "@/lib/constants"

interface CarItemsProps {
    carItems: ItemsCarsWithAlll[];
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
}


export default function MyCarsPage({ carItems }: CarItemsProps) {
    const [carsItems, setCarItems] = useState<ItemsCarsWithAlll[]>(carItems);
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [search, setSearch] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // pagination
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        totalCount: carItems.length,
        pageSize: CARS_PER_PAGE,
    });


    const filteredCars = carsItems.filter((car) => {
        const carName = car?.name?.toLowerCase() || ""
        const modelName = car.model?.name || ""
        const status = car?.status?.toLowerCase() || ""

        const matchesSearch = carName.includes(searchQuery.toLowerCase())
        const matchesType = typeFilter === "all" || modelName === typeFilter
        const matchesStatus = statusFilter === "all" || status === statusFilter.toLowerCase()

        return matchesSearch && matchesType && matchesStatus
    })

    // Filter cars by category and search
    useEffect(() => {
        let updatedCars = [...carItems];

        if (selectedCategory !== "all") {
            updatedCars = updatedCars.filter((c) => c.category?.id === selectedCategory);
        }

        if (search.trim() !== "") {
            const s = search.toLowerCase();
            updatedCars = updatedCars.filter((c) => c.name.toLowerCase().includes(s));
        }

        const totalCount = updatedCars.length;
        const totalPages = Math.ceil(totalCount / pagination.pageSize);
        const start = (pagination.currentPage - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;

        setPagination((prev) => ({ ...prev, totalCount, totalPages }));
        setCarItems(updatedCars.slice(start, end));
    }, [selectedCategory, search, pagination.currentPage, carItems]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="flex flex-1 flex-col">
            <CompanyHeader title="My Cars" description="Manage your vehicle inventory" />
            <main className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <Badge className="text-sm text-gray-500">
                        {filteredCars.length} vehicles • {filteredCars.filter((c) => c.status === "AVAILABLE").length} available
                    </Badge>

                    <Link href={"/company/cars/new"}>
                        <Button className="hover:cursor-pointer">
                            <Plus className="mr-2 size-4" />
                            Add New Car
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white" />
                        <Input
                            placeholder="Search by customer or car..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-amber-700 border-amber-600 text-white placeholder:text-white/70 focus:ring-2 focus:ring-amber-600"
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-amber-700 border-amber-600 text-white">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent className="bg-amber-900 border-amber-700 text-white">
                            <SelectItem value="all">All Types</SelectItem>
                            {/* {Array.from(new Set(carsItems.map(c => c.model?.name))).map(model => (
                                <SelectItem key={model} value={model}>{model}</SelectItem>
                            ))} */}
                            {Array.from(new Set(carsItems.map(c => c.model?.name).filter(Boolean) as string[]))
                                .map(model => (
                                    <SelectItem key={model} value={model} className="hover:cursor-pointer">{model}</SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-amber-700 border-amber-600 text-white">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="bg-amber-900 border-amber-700 text-white">
                            <SelectItem value="all" className="hover:cursor-pointer">All Status</SelectItem>
                            <SelectItem value="AVAILABLE" className="hover:cursor-pointer">Available</SelectItem>
                            <SelectItem value="RENTED" className="hover:cursor-pointer">Rented</SelectItem>
                            <SelectItem value="MAINTENANCE" className="hover:cursor-pointer">Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredCars.map((car) => (
                        <Card key={car.id} className="bg-amber-800 text-white">
                            <CardHeader className="p-0">
                                {car.images?.[0]?.imageUrl ? (
                                    <div className="w-full h-40 overflow-hidden rounded-t-lg group">
                                        <Image
                                            src={car.images[0].imageUrl}
                                            alt={car.name || "Car Image"}
                                            width={500}
                                            height={300}
                                            className="w-full h-full object-cover hover:cursor-pointer transition-transform duration-700 group-hover:scale-150"  // <<< يضمن ملاءمة الصورة بدون تشويه
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-40 w-full rounded-t-lg bg-gray-200">
                                        <p className="text-center animate-pulse">No Image</p>
                                    </div>
                                )}
                            </CardHeader>

                            <CardContent className="pt-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="lg:text-lg text-[1rem]">{car.name}</CardTitle>
                                        <p className="text-sm text-gray-400">
                                            {car.category?.name} • {car.year}
                                        </p>
                                    </div>
                                    <Badge variant={car.status === "AVAILABLE" ? "default" : car.status === "RENTED" ? "destructive" : "outline"}>{car.status}</Badge>
                                </div>
                                <p className="mt-4 lg:text-xl text-lg font-bold">{car.pricePerDay} TND/day</p>
                            </CardContent>

                            <CardFooter className="flex items-center justify-center gap-2">
                                <Button disabled variant="destructive" className="hover:cursor-pointer flex-1">
                                    Remove
                                </Button>

                                <Link href={""}>
                                    <Button variant={"outline"} className="group hover:cursor-pointer">
                                        <ExternalLink className="text-black group-hover:translate-x-2 group-hover:-translate-y-2 flex-1 duration-500" />
                                    </Button>
                                </Link>

                                <Link href={`/company/cars/${car.id}`} >
                                    <Button variant="default" className="hover:cursor-pointer text-white flex-1 ">
                                        Edit
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-12 pt-8">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="text-sm text-gray-400 text-center">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="flex items-center gap-2 px-6"
                                >
                                    <ChevronLeft size={24} />
                                    Previous
                                </Button>

                                <div className="flex items-center gap-2 px-4 text-white">
                                    <span className="text-lg font-semibold">{pagination.currentPage}</span>
                                    <span className="text-gray-400">of</span>
                                    <span className="text-lg font-semibold">{pagination.totalPages}</span>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="flex items-center gap-2 px-6"
                                >
                                    Next
                                    <ChevronRight size={24} />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
