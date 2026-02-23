/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { GiHorseHead } from "react-icons/gi";
import {
    ShoppingCart,
    Search,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { CarWithAll } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart_context";
import { CARS_PER_PAGE } from "@/lib/constants";
import { FaCalendarDays } from "react-icons/fa6";

interface Props {
    cars: CarWithAll[];
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

    const [filteredCars, setFilteredCars] = useState<CarWithAll[]>(cars);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [search, setSearch] = useState("");
    const [loading] = useState(false);

    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        totalCount: cars.length,
        pageSize: CARS_PER_PAGE,
    });

    const categories = Array.from(
        new Map(
            cars.filter(c => c.category).map(c => [c.category!.id, c.category!])
        ).values()
    );

    useEffect(() => {
        let updated = [...cars];

        if (selectedCategory !== "all") {
            updated = updated.filter(c => c.category?.id === selectedCategory);
        }

        if (search.trim()) {
            const s = search.toLowerCase();
            updated = updated.filter(c => c.name.toLowerCase().includes(s));
        }

        const totalCount = updated.length;
        const totalPages = Math.ceil(totalCount / pagination.pageSize);
        const start = (pagination.currentPage - 1) * pagination.pageSize;

        setPagination(p => ({ ...p, totalCount, totalPages }));
        setFilteredCars(updated.slice(start, start + pagination.pageSize));
    }, [selectedCategory, search, pagination.currentPage, cars, pagination.pageSize]);

    useEffect(() => {
        if (!containerRef.current) return;
        gsap.fromTo(
            containerRef.current.querySelectorAll(".car-card"),
            { opacity: 0, y: 40, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.08,
                duration: 0.6,
                ease: "power3.out",
            }
        );
    }, [filteredCars]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > pagination.totalPages) return;
        setPagination(p => ({ ...p, currentPage: page }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen p-4 mt-32 bg-background text-foreground">
            {/* Title */}
            <section className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold">
                    Explore Our <span className="text-primary">Cars</span> Collection
                </h1>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-44 bg-background/60 border-border">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            setPagination(p => ({ ...p, currentPage: 1 }));
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            placeholder="Search by car title..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-64 bg-background/60 border-border"
                        />
                        <Button type="submit" variant="outline">
                            <Search className="h-4 w-4 mr-2" /> Search
                        </Button>
                    </form>
                </div>
            </section>

            {/* Grid */}
            <div
                ref={containerRef}
                className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
                {loading ? (
                    <div className="col-span-full flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredCars.length === 0 ? (
                    <p className="col-span-full text-center text-muted-foreground">
                        No cars found.
                    </p>
                ) : (
                    filteredCars.map(car => (
                        <Card
                            key={car.id}
                            className="car-card group relative overflow-hidden rounded-2xl
                                bg-slate-100 dark:bg-card/70 border-border backdrop-blur
                                hover:border-primary/50 transition-all duration-300"
                        >
                            <CardContent className="p-0">
                                <div className="relative h-56">
                                    {car.images?.[0]?.imageUrl ? (
                                        <Image
                                            src={car.images[0].imageUrl}
                                            alt={car.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">
                                            No image
                                        </div>
                                    )}

                                    {/* company badge */}
                                    {car.company && (
                                        <div className="absolute top-3 left-3 flex items-center gap-2 bg-accent/50 backdrop-blur-md px-2 py-1 rounded-lg shadow">
                                            {car.company.logo && (
                                                <Image
                                                    src={car.company.logo}
                                                    alt={car.company.name}
                                                    width={20}
                                                    height={20}
                                                    className="object-contain"
                                                />
                                            )}
                                            <span className="text-xs font-semibold text-black dark:text-white">
                                                {car.company.name}
                                            </span>
                                        </div>
                                    )}

                                    <h2 className="absolute bottom-3 bg-primary/40 px-2 left-4 text-xl font-bold text-black dark:text-white drop-shadow">
                                        {car.name}
                                    </h2>
                                </div>

                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Badge variant="outline">{car.category?.name}</Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {car.year}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold inline-flex gap-2 items-center">
                                            {car.pricePerDay} TND/Day
                                            <FaCalendarDays className="text-primary" />
                                        </span>
                                        <span className="text-sm inline-flex gap-1 items-center">
                                            <GiHorseHead className="text-primary" /> {car.horsepower} HP
                                        </span>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            className="flex-1 hover:cursor-pointer"
                                            disabled={car.status !== "AVAILABLE"}
                                            onClick={() =>
                                                addItem(
                                                    {
                                                        ...car,
                                                        category: car.category ?? { id: "unknown", name: "Unknown" },
                                                        model: car.model ?? { id: "unknown", name: "Unknown" },
                                                        images: (car.images ?? []).map(img => ({
                                                            ...img,
                                                            carId: car.id,
                                                        })),
                                                    },
                                                    1
                                                )
                                            }
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            Add to Cart
                                        </Button>

                                        <Link href={`/market-cars/${car.id}`}>
                                            <Button variant="outline" className="hover:cursor-pointer">Details</Button>
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
                <div className="mt-14 flex justify-center items-center gap-4">
                    <Button
                        variant="outline"
                        disabled={pagination.currentPage === 1}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                    >
                        <ChevronLeft />
                    </Button>

                    <span className="font-medium">
                        {pagination.currentPage} / {pagination.totalPages}
                    </span>

                    <Button
                        variant="outline"
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                    >
                        <ChevronRight />
                    </Button>
                </div>
            )}
        </div>
    );
}
