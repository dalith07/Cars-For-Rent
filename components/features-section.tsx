"use client";

import { Car, Shield, Timer, Droplet } from "lucide-react";
import { motion } from "framer-motion";

const cars = [
    {
        name: "Tesla Model S",
        type: "Electric / Sedan",
        maxDays: 7,
        features: ["Autopilot", "Fast Charging", "Premium Sound"],
        pricePerDay: "$120",
        icon: <Car className="h-10 w-10 text-yellow-500" />,
    },
    {
        name: "Golf 7",
        type: "SUV / Gasoline",
        maxDays: 7,
        features: ["All-Wheel Drive", "GPS", "Leather Seats"],
        pricePerDay: "$100",
        icon: <Car className="h-10 w-10 text-yellow-500" />,
    },
    {
        name: "BMW E90",
        type: "Sports / Gasoline",
        maxDays: 7,
        features: ["Turbo Engine", "Sport Mode", "GPS"],
        pricePerDay: "$250",
        icon: <Car className="h-10 w-10 text-yellow-500" />,
    },
];

// const iconVariants = {
//     initial: { x: 0 },
//     hover: { x: 40 },
// };

export default function CarsForRentSection() {
    return (
        // <section className="relative w-full py-24 px-6 bg-black/10 backdrop-blur-xl text-white">
        <section className="relative w-full py-24 px-6 bg-muted/30 dark:bg-black/5 backdrop-blur-xs text-foreground">
            <div className="max-w-6xl mx-auto text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="lg:text-5xl text-lg font-bold mb-4"
                >
                    Rent <span className="text-yellow-500 dark:text-yellow-500">Your Dream Car</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-muted-foreground dark:text-white/60 text-lg"
                >
                    Choose your car, see how long you can rent it, and enjoy exclusive features.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto ">
                {cars.map((car, index) => (
                    <motion.div
                        key={index}
                        initial="initial"
                        whileHover="hover"
                        className="bg-card dark:bg-black/30 group 
                        hover:bg-accent/50 dark:hover:bg-purple-400/10 
                        duration-500 border hover:cursor-pointer border-border
                         dark:border-purple-400/20 hover:border-primary 
                         dark:hover:border-purple-400/40 rounded-xl px-8 py-10 
                         shadow-xl hover:shadow-2xl transition text-card-foreground"
                    >
                        <div className="flex items-center mb-4 space-x-3">
                            <motion.span
                                initial={{ rotate: 0, y: 0, opacity: 1 }}
                                whileHover={{
                                    rotate: [0, 15, -15, 0],       // icon rotates back and forth
                                    y: [0, -5, 5, 0],              // icon moves up and down slightly
                                    scale: [1, 1.1, 1, 1.05],      // small pulsation
                                    transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                                }}
                                className="inline-block relative"
                            >
                                {car.icon}

                                {/* Optional “dust / particle” effect */}
                                <motion.span
                                    className="absolute w-1 h-1 bg-yellow-400 rounded-full top-1 left-1 opacity-50"
                                    initial={{ opacity: 0, x: 0, y: 0 }}
                                    whileHover={{
                                        opacity: [0, 0.5, 0],
                                        x: [-5, 10, -10],
                                        y: [-5, -10, 5],
                                        transition: { duration: 1, repeat: Infinity },
                                    }}
                                />
                            </motion.span>


                            <h3 className="text-2xl font-semibold text-card-foreground">{car.name}</h3>
                        </div>

                        <p className="text-muted-foreground dark:text-white/60 mb-2">{car.type}</p>

                        <div className="flex items-center mb-2 text-muted-foreground dark:text-white/70 space-x-4">
                            <Timer className="h-5 w-5 text-yellow-500" />
                            <span>Max Rental: {car.maxDays} days</span>
                        </div>

                        <div className="flex items-center mb-2 text-muted-foreground dark:text-white/70 space-x-4">
                            <Shield className="h-5 w-5 text-yellow-500" />
                            <span>Features: {car.features.join(", ")}</span>
                        </div>

                        <div className="flex items-center text-muted-foreground dark:text-white/70 space-x-4">
                            <Droplet className="h-5 w-5 text-yellow-500" />
                            <span>Price: {car.pricePerDay} / day</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
