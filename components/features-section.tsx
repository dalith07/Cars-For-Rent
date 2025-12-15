// "use client";

// import { Car, Shield, Timer } from "lucide-react";
// import { motion } from "framer-motion";

// const cards = [
//     {
//         icon: <Car className="h-10 w-10 text-yellow-500" />,
//         title: "Premium Fleet",
//         text: "Choose from luxury, sport, and eco-friendly vehicles.",
//     },
//     {
//         icon: <Shield className="h-10 w-10 text-yellow-500" />,
//         title: "Full Insurance",
//         text: "Drive with peace of mind, fully protected 24/7.",
//     },
//     {
//         icon: <Timer className="h-10 w-10 text-yellow-500" />,
//         title: "Fast Booking",
//         text: "Instant confirmation and lightning-fast pickup.",
//     },
// ];

// export default function FeaturesSection() {
//     return (
//         <section className="relative w-full py-24 text-white px-6 bg-black/10 backdrop-blur-xl">
//             <div className="max-w-6xl mx-auto text-center mb-16">
//                 <motion.h2
//                     initial={{ opacity: 0, y: 40 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.7 }}
//                     viewport={{ once: true }}
//                     className="text-4xl font-bold mb-4"
//                 >
//                     Why Choose <span className="text-yellow-500">Speed Cars?</span>
//                 </motion.h2>
//                 <motion.p
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.7, delay: 0.2 }}
//                     viewport={{ once: true }}
//                     className="text-white/60 text-lg"
//                 >
//                     We provide world-class service to make your journey unforgettable.
//                 </motion.p>
//             </div>

//             <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
//                 {cards.map((card, index) => (
//                     <motion.div
//                         key={index}
//                         initial={{ opacity: 0, y: 50 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
//                         viewport={{ once: true }}
//                         className="bg-zinc-900 rounded-xl px-8 py-10 shadow-xl border border-white/5 hover:scale-[1.03] hover:shadow-2xl transition duration-300"
//                     >
//                         <div className="mb-4">{card.icon}</div>
//                         <h3 className="text-2xl font-semibold mb-2">{card.title}</h3>
//                         <p className="text-white/60">{card.text}</p>
//                     </motion.div>
//                 ))}
//             </div>

//             {/* Optional bottom blur glow */}
//             {/* <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-yellow-500/10 to-transparent blur-3xl"></div> */}
//         </section>
//     );
// }


"use client";

import { Car, Shield, Timer, Droplet } from "lucide-react";
import { motion } from "framer-motion";

const cars = [
    {
        name: "Tesla Model S",
        type: "Electric / Sedan",
        maxDays: 14,
        features: ["Autopilot", "Fast Charging", "Premium Sound"],
        pricePerDay: "$120",
        icon: <Car className="h-10 w-10 text-yellow-500" />,
    },
    {
        name: "BMW X5",
        type: "SUV / Gasoline",
        maxDays: 10,
        features: ["All-Wheel Drive", "GPS", "Leather Seats"],
        pricePerDay: "$100",
        icon: <Car className="h-10 w-10 text-yellow-500" />,
    },
    {
        name: "Porsche 911",
        type: "Sports / Gasoline",
        maxDays: 7,
        features: ["Turbo Engine", "Sport Mode", "Convertible"],
        pricePerDay: "$250",
        icon: <Car className="h-10 w-10 text-yellow-500" />,
    },
];

const iconVariants = {
    initial: { x: 0 },
    hover: { x: 40 },
};

export default function CarsForRentSection() {
    return (
        <section className="relative w-full py-24 px-6 bg-black/10 backdrop-blur-xl text-white">
            <div className="max-w-6xl mx-auto text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold mb-4"
                >
                    Rent <span className="text-yellow-500">Your Dream Car</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-white/60 text-lg"
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
                        className="bg-black/30 group hover:bg-black/50 duration-500 border hover:cursor-pointer border-purple-400 hover:border-purple-500 rounded-xl px-8 py-10 shadow-xl hover:shadow-2xl transition"
                    >
                        <div className="flex items-center mb-4 space-x-3">
                            <motion.span
                                variants={iconVariants}
                                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                                className="inline-block ">
                                {car.icon}
                            </motion.span>

                            <h3 className="text-2xl font-semibold">{car.name}</h3>
                        </div>

                        <p className="text-white/60 mb-2">{car.type}</p>

                        <div className="flex items-center mb-2 text-white/70 space-x-4">
                            <Timer className="h-5 w-5 text-yellow-500" />
                            <span>Max Rental: {car.maxDays} days</span>
                        </div>

                        <div className="flex items-center mb-2 text-white/70 space-x-4">
                            <Shield className="h-5 w-5 text-yellow-500" />
                            <span>Features: {car.features.join(", ")}</span>
                        </div>

                        <div className="flex items-center text-white/70 space-x-4">
                            <Droplet className="h-5 w-5 text-yellow-500" />
                            <span>Price: {car.pricePerDay} / day</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
