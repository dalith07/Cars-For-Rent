/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, CheckCircle, ExternalLink, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/language-provider";
import { TbEngine } from "react-icons/tb";
import { GiHorseHead } from "react-icons/gi";
import { CarStatus } from "@prisma/client";

interface Car {
    id: string;
    name: string;
    img: string;
    price: string;
    fuel: string;
    speed: string;
    discount?: string;
    status: CarStatus;
}

interface PopularCarsProps {
    cars: Car[];
}

const BATCH_SIZE = 3;
const INTERVAL_TIME = 5000;

export default function PopularCars({ cars }: PopularCarsProps) {
    const { t } = useLanguage();

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

    const statusConfig: Record<CarStatus, {
        label: string;
        color: string;
        icon: any;
    }> = {
        AVAILABLE: { label: "Available", color: "text-green-500", icon: CheckCircle },
        RENTED: { label: "Rented", color: "text-red-500", icon: Car },
        MAINTENANCE: { label: "Maintenance", color: "text-orange-500", icon: Wrench },
    };

    return (
        <section className="py-20 bg-muted/30 dark:bg-black/5 backdrop-blur-xs">
            <div className="container mx-auto px-6">

                <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
                    {t("popularTitle")} <span className="text-yellow-500 dark:text-yellow-500"> {t("popularTitleHighlighted")}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

                    {carsToShow.map((car, cardIndex) => {
                        const status = statusConfig[car.status];
                        const StatusIcon = status.icon;

                        return (
                            <motion.div
                                key={cardIndex}
                                onMouseEnter={stopInterval}
                                onMouseLeave={startInterval}
                                whileHover={{ y: -8, scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="relative border border-border rounded-2xl p-6 
      backdrop-blur-sm bg-card group hover:bg-accent/50 dark:hover:bg-primary/15
      duration-500 cursor-pointer"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={car.name}
                                        initial={{ opacity: 0, y: 25 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -25 }}
                                        transition={{ duration: 0.45 }}
                                    >
                                        <>
                                            {car.discount && (
                                                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full
              bg-linear-to-r bg-accent-foreground text-accent shadow-lg animate-bounce">
                                                    {car.discount} OFF
                                                </span>
                                            )}

                                            <Link href={`/market-cars/${car.id}`}>
                                                <span className="absolute bottom-4 right-4 text-xs font-bold
              text-blue-400 opacity-0 group-hover:opacity-100
              group-hover:-translate-y-1.5 group-hover:translate-x-1.5
              group-hover:scale-110 duration-500">
                                                    <ExternalLink />
                                                </span>
                                            </Link>

                                            <div className="flex justify-center mb-4 group">
                                                <div className="w-[170px] h-[110px] group-hover:scale-150 duration-500 relative">
                                                    <Image
                                                        src={car.img}
                                                        alt={car.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-bold text-center">
                                                {car.name}
                                            </h3>

                                            <p className="text-center text-primary mt-2 text-lg font-bold">
                                                {car.price}
                                            </p>

                                            <div className="mt-4 space-y-3 text-muted-foreground">
                                                <div className="flex gap-2">
                                                    <TbEngine size={28} className="text-yellow-500" />
                                                    Engine: {car.fuel}
                                                </div>

                                                <div className="flex gap-2">
                                                    <GiHorseHead size={24} className="text-yellow-500" />
                                                    Horse Power: {car.speed}
                                                </div>

                                                <div className="flex gap-2 font-semibold items-center">
                                                    <StatusIcon className="text-yellow-500" />
                                                    <span className={status.color}>{status.label}</span>
                                                </div>
                                            </div>
                                        </>
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}


                </div>
            </div>
        </section>
    );
}
