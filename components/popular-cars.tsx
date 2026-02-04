/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Fuel, Gauge, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Car {
    id: string;
    name: string;
    img: string;
    price: string;
    fuel: string;
    speed: string;
    discount?: string;
    available: string;
}

interface PopularCarsProps {
    cars: Car[];
}

const BATCH_SIZE = 3;
const INTERVAL_TIME = 5000;

export default function PopularCars({ cars }: PopularCarsProps) {
    const [startIndex, setStartIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startInterval = () => {
        if (intervalRef.current || cars.length <= BATCH_SIZE) return;

        intervalRef.current = setInterval(() => {
            setStartIndex(prev =>
                prev + BATCH_SIZE >= cars.length ? 0 : prev + BATCH_SIZE
            );
        }, INTERVAL_TIME);
    };

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        startInterval();
        return stopInterval;
    }, [cars.length]);

    const carsToShow = cars.slice(startIndex, startIndex + BATCH_SIZE);

    return (
        <section className="py-20 bg-muted/30 dark:bg-black/5 backdrop-blur-xs">
            <div className="container mx-auto px-6">

                <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
                    New Cars Available <span className="text-yellow-500 dark:text-yellow-500">For Rent</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

                    {carsToShow.map((_, cardIndex) => (
                        <motion.div
                            key={cardIndex}
                            onMouseEnter={stopInterval}   // ✅ pause
                            onMouseLeave={startInterval} // ✅ resume
                            whileHover={{
                                y: -8,
                                scale: 1.03,
                                // boxShadow: "0px 0px 35px rgba(31,41,55)",
                            }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="relative border border-border rounded-2xl p-6 
                            backdrop-blur-sm bg-card group hover:bg-accent/50 dark:hover:bg-primary/15
                             duration-500 cursor-pointer"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={carsToShow[cardIndex]?.name}
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -25 }}
                                    transition={{ duration: 0.45 }}
                                >
                                    {carsToShow[cardIndex] && (
                                        <>
                                            {/* Discount */}
                                            {carsToShow[cardIndex].discount && (
                                                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full
                                                bg-linear-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse">
                                                    {carsToShow[cardIndex].discount} OFF
                                                </span>
                                            )}

                                            {/* Link go to car by id */}
                                            <Link href={`/market-cars/${carsToShow[cardIndex].id}`}>
                                                <span
                                                    className="absolute bottom-4 right-4 text-xs font-bold
                                                text-blue-400/80 opacity-0 group-hover:opacity-100
                                                group-hover:-translate-y-1.5 group-hover:translate-x-1.5
                                                group-hover:scale-110 duration-500"
                                                >
                                                    <ExternalLink />
                                                </span>
                                            </Link>

                                            {/* Image */}
                                            <div className="flex justify-center mb-4">
                                                <div className="w-[170px] h-[110px] relative">
                                                    <Image
                                                        src={carsToShow[cardIndex].img}
                                                        alt={carsToShow[cardIndex].name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-semibold text-card-foreground text-center">
                                                {carsToShow[cardIndex].name}
                                            </h3>

                                            <p className="text-center text-primary dark:text-purple-300 mt-2 text-lg font-bold">
                                                {carsToShow[cardIndex].price}
                                            </p>

                                            <div className="mt-4 space-y-3 text-muted-foreground dark:text-white/80">
                                                <div className="flex gap-3">
                                                    <Fuel className="text-yellow-500" />
                                                    Fuel: {carsToShow[cardIndex].fuel}
                                                </div>
                                                <div className="flex gap-3">
                                                    <Gauge className="text-yellow-500" />
                                                    Speed: {carsToShow[cardIndex].speed}
                                                </div>
                                                <div className="flex gap-3">
                                                    <Timer className="text-yellow-500" />
                                                    Available: {carsToShow[cardIndex].available}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
}
