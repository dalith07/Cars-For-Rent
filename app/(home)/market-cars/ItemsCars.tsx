/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Search, Loader2, Timer, CalendarDays } from "lucide-react";
import { ItemsCarsWithAlll } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ARTICLE_PER_PAGE } from "@/lib/constants";
import { useCart } from "@/lib/cart_context";

interface Props {
    cars: ItemsCarsWithAlll[];
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
}

export default function ItemsCarsClient({ cars }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { addItem } = useCart();

    const [filteredCars, setFilteredCars] = useState<ItemsCarsWithAlll[]>(cars);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState(false);


    // pagination
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        totalCount: cars.length,
        pageSize: ARTICLE_PER_PAGE,
    });

    // categories
    const categories = Array.from(
        new Map(
            cars
                .filter((c) => c.category)
                .map((c) => [c.category!.id, c.category!])
        ).values()
    );

    // Filter cars by category and search
    useEffect(() => {
        let updatedCars = [...cars];

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
        setFilteredCars(updatedCars.slice(start, end));
    }, [selectedCategory, search, pagination.currentPage, cars]);

    // Animate cars on filter change
    useEffect(() => {
        if (filteredCars.length > 0 && containerRef.current) {
            gsap.fromTo(
                containerRef.current.querySelectorAll(".car-card"),
                { opacity: 0, y: 40, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: "power3.out",
                }
            );
        }
    }, [filteredCars]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen p-4 mt-32">
            <section className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Explore Our <span className="text-yellow-500">Cars</span> Collection
                </h1>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                        <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setPagination((prev) => ({ ...prev, currentPage: 1 }));
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            placeholder="Search by car title..."
                            className="w-64 bg-white/10 border-white/20 text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button type="submit" className="text-white hover:cursor-pointer">
                            <Search className="h-4 w-4 mr-2" /> Search
                        </Button>
                    </form>
                </div>
            </section>

            {/* Car grid */}
            <div ref={containerRef} className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                    <div className="col-span-full flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-gray-300">Loading cars...</span>
                    </div>
                ) : filteredCars.length === 0 ? (
                    <p className="text-white col-span-full text-center">No cars found.</p>
                ) : (
                    filteredCars.map((car) => (
                        <Card
                            key={car.id}
                            className="group relative bg-gray-900/60
                            border border-gray-700 hover:border-yellow-400
                            transition-all duration-300 hover:shadow-yellow-500/20
                            hover:shadow-xl overflow-hidden rounded-2xl"
                        >
                            {/* 
                                group-hover:-translate-y-1
                                group-hover:translate-x-46
                                translate-x-80
                            */}
                            <span
                                className={`
                                absolute text-center top-6 z-50 translate-x-46 -translate-y-1
                                rotate-45 text-sm w-38 py-1
                                transition-all duration-700
                                opacity-30 group-hover:opacity-100  
                                ${car.status === "available"
                                        ? "bg-green-100 text-green-800"
                                        : car.status === "rented"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                            >
                                {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                            </span>

                            <CardContent className="p-0 ">
                                <div className="relative w-full h-56 overflow-hidden group">
                                    {car.imagesOnCars && car.imagesOnCars.length > 0 && car.imagesOnCars[0]?.imageUrl ? (
                                        <Image
                                            src={car.imagesOnCars[0].imageUrl}
                                            alt={car.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                            <span className="text-gray-500 text-sm">No image available</span>
                                        </div>
                                    )}
                                    <h2 className="absolute bottom-3 left-4 text-xl font-bold text-white pointer-events-none">
                                        {car.name}
                                    </h2>
                                </div>

                                <div className="p-4 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <Badge variant="outline" className="text-white bg-white/10 border-white/20">{car.category?.name}</Badge>
                                        <span>{car.year}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-cyan-400">
                                            {(car.price ?? 0)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                            DT/ Day <CalendarDays className="inline-flex text-amber-100 animate-bounce" size={"20"} />
                                        </span>
                                        <span className="text-sm text-gray-400">{car.horsepower} HP</span>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            className="flex-1 text-white hover:cursor-pointer"
                                            onClick={() =>
                                                addItem({
                                                    id: car.id,
                                                    name: car.name,
                                                    price: car.price,
                                                    discount: car.discount ?? 0,
                                                    imagesOnCars: car.imagesOnCars ?? [],
                                                    category: {
                                                        id: car.category?.id ?? "unknown",
                                                        name: car.category?.name ?? "Unknown",
                                                    },
                                                    model: {
                                                        id: car.model?.id ?? "unknown",
                                                        name: car.model?.name ?? "Unknown",
                                                    },

                                                    quantity: car.quantity ?? 0,
                                                    description: car.description,
                                                } as any)
                                            }
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2 animate-bounce" />
                                            Add to Cart
                                        </Button>

                                        <Link href={`/market-cars/${car.id}`}>
                                            <Button
                                                variant="outline"
                                                className="hover:cursor-pointer">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
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
                                className="flex items-center gap-2 bg-transparent px-6"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
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
                                className="flex items-center gap-2 bg-transparent px-6"
                            >
                                Next
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
