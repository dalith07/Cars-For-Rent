/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { MoreHorizontal, AlertCircle, ChevronLeft, ChevronRight, Plus, Ellipsis, Delete, Trash, Eye, Trash2 } from "lucide-react"
import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import Header from "../dashboard/header"
import { Button } from "../ui/button"
import Link from "next/link"
import { ItemsCars } from "@prisma/client"
import { ItemsCarsWithAll, ItemsCarsWithAlll } from "@/lib/utils"
import { deleteCarItem } from "@/actions/dashboard/cars"

interface CarItemsProps {
    carItems: ItemsCarsWithAlll[];
}

export default function CarsPage({ carItems }: CarItemsProps) {
    const [carsItems, setCarItems] = useState<ItemsCarsWithAlll[]>(carItems);
    const containerRef = useRef<HTMLDivElement>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const [sidebarOpen, setSidebarOpen] = useState(true)
    // const [activePage, setActivePage] = useState("dashboard")
    const [showNotifications, setShowNotifications] = useState(false)

    const cars = carsItems.map((item) => ({
        id: item.id,
        model: item.name,
        year: item.year,
        status: item.status,
        price: item.price.toString(),
    }));

    const totalPages = Math.ceil(cars.length / itemsPerPage)
    const startIdx = (currentPage - 1) * itemsPerPage
    const paginatedCars = cars.slice(startIdx, startIdx + itemsPerPage)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available":
                return "bg-green-50 text-green-700"
            case "sold":
                return "bg-gray-50 text-gray-700"
            case "maintenance":
                return "bg-orange-50 text-orange-700"
            default:
                return "bg-gray-50 text-gray-700"
        }
    }

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current.querySelectorAll(".car-row"),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
            )
        }
    }, [currentPage])

    return (
        <div ref={containerRef} className="animate-fade-in flex h-screen bg-background">

            <div className="flex-1">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Cars</h1>
                        <p className="text-muted-foreground">Manage your vehicle inventory</p>
                    </div>

                    <div>
                        <Link href={`/dashboard/cars/new`}>
                            <Button size="lg" className="group hover:cursor-pointer">
                                <Plus className="group-hover:animate-ping" />Create
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {paginatedCars.map((car, index) => (
                        <div
                            key={index}
                            className="car-row bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-foreground">{car.model}</h3>
                                    {/* <p className="text-sm text-muted-foreground">{car.id}</p> */}
                                </div>
                                <button
                                    className="text-muted-foreground hover:cursor-pointer hover:text-blue-500"
                                    onClick={() => setOpenMenuId(openMenuId === car.id ? null : car.id)}
                                >
                                    <Ellipsis size={24} className="hover:scale-125 duration-500" />
                                </button>
                            </div>

                            {openMenuId === car.id && (
                                <div className="absolute right-12 top-12 bg-card border border-border shadow-lg rounded-lg p-2 z-50 w-32 animate-fade-in">
                                    <Link href={`/dashboard/cars/${car.id}`}>
                                        <button
                                            className="w-full hover:cursor-pointer text-left group px-4 py-2 hover:bg-muted transition-colors text-sm text-foreground flex items-center gap-2 border-b border-border">
                                            <Eye className="w-4 h-4 group-hover:animate-ping" />
                                            view
                                        </button>
                                    </Link>

                                    <button
                                        className="w-full hover:cursor-pointer text-left group px-4 py-2 hover:bg-red-500/20 transition-colors text-sm text-red-600 flex items-center gap-2"
                                        onClick={async () => {
                                            await deleteCarItem(car.id);
                                            window.location.reload();
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 group-hover:animate-ping" />
                                        Delete
                                    </button>
                                </div>
                            )}

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Year</span>
                                    <span className="font-medium text-foreground">{car.year}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Price</span>
                                    <span className="font-semibold text-[13px] text-primary">{(car.price ?? 0)
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                        DT / <span className="text-blue-500 font-bold animate-pulse">Day</span></span>
                                </div>
                            </div>

                            <div
                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor(car.status)} text-xs font-medium`}
                            >
                                {car.status === "maintenance" && <AlertCircle className="w-3 h-3" />}
                                <span className="capitalize">{car.status}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between bg-card rounded-xl border border-border p-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, cars.length)} of {cars.length} cars
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg font-medium transition-colors ${currentPage === i + 1
                                        ? "bg-primary text-primary-foreground"
                                        : "border border-border text-muted-foreground hover:bg-accent"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
