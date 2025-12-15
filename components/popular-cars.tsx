"use client";

import { motion } from "framer-motion";
import { Fuel, Gauge, Timer } from "lucide-react";
import Image from "next/image";

const cars = [
    {
        name: "Mercedes G Class",
        img: "/cars/Mercedes-G-Class.png",
        price: "150 TND / day",
        fuel: "Diesel",
        speed: "260 km/h",
        discount: "10%",
        available: "Yes",
    },
    {
        name: "BMW M5 Competition",
        img: "/cars/bmw_m5_competition_2.png",
        price: "170 TND / day",
        fuel: "Petrol",
        speed: "260 km/h",
        discount: "0%",
        available: "Yes",
    },
    {
        name: "Bentley Bentayga",
        img: "/cars/Bentley-Bentayga-1.png",
        price: "110 TND / day",
        fuel: "Petrol",
        speed: "235 km/h",
        discount: "15%",
        available: "No",
    },
];

export default function PopularCars() {
    return (
        <section className="py-20 bg-linear-to-b from-black via-zinc-900 to-black">
            <div className="container mx-auto px-6">

                {/* Section Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold text-center mb-12 text-white"
                >
                    New Cars Available <span className="text-yellow-500">For Rent</span>
                </motion.h2>

                {/* Cars Grid */}
                <div className="grid md:grid-cols-3 gap-10">
                    {cars.map((car, index) => (
                        <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                y: 50,
                                backgroundColor: "rgba(255,255,255,0.05)",
                                borderColor: "rgba(168,85,247,0.4)",
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(255,255,255,0.08)",
                                borderColor: "rgba(168,85,247,0.8)",
                                boxShadow:
                                    "0px 0px 25px rgba(168, 85, 247, 0.5)",
                            }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.2,
                            }}
                            viewport={{ once: true }}
                            className="relative group border rounded-2xl p-6 shadow-xl backdrop-blur-sm cursor-pointer"
                        >

                            {/* Discount Badge */}
                            {car.discount && (
                                <motion.span
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                    className="absolute top-4 right-4 opacity-30 group-hover:opacity-100 duration-700 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg"
                                >
                                    {car.discount} OFF
                                </motion.span>
                            )}

                            {/* Image */}
                            <motion.div
                                className="flex justify-center mb-4"
                                whileHover={{ scale: 1.15, y: -10 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 250,
                                    damping: 15,
                                }}
                            >
                                <div className="w-[150px] h-[100px] relative">
                                    <Image
                                        src={car.img}
                                        alt={car.name}
                                        fill
                                        className="object-contain pointer-events-none"
                                    />
                                </div>
                            </motion.div>

                            {/* Title */}
                            <h3 className="text-2xl font-semibold text-white text-center">
                                {car.name}
                            </h3>

                            {/* Price */}
                            <p className="text-center text-purple-300 mt-2 text-lg font-bold">
                                {car.price}
                            </p>

                            {/* Specs */}
                            <div className="mt-4 space-y-3 text-white/80">
                                <div className="flex items-center gap-3">
                                    <Fuel className="text-yellow-500" />
                                    <span>Fuel: {car.fuel}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Gauge className="text-yellow-500" />
                                    <span>Top Speed: {car.speed}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Timer className="text-yellow-500" />
                                    <span>Available: {car.available}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
