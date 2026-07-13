// "use client";

// import { Car, Shield, Timer, Droplet } from "lucide-react";
// import { motion } from "framer-motion";
// import { useLanguage } from "@/app/language-provider";

// const cars = [
//     {
//         name: "Tesla Model S",
//         type: "Electric / Sedan",
//         maxDays: 7,
//         features: ["Autopilot", "Fast Charging", "Premium Sound"],
//         pricePerDay: "$120",
//         icon: <Car className="h-10 w-10 text-yellow-500" />,
//     },
//     {
//         name: "Golf 7",
//         type: "SUV / Gasoline",
//         maxDays: 7,
//         features: ["All-Wheel Drive", "GPS", "Leather Seats"],
//         pricePerDay: "$100",
//         icon: <Car className="h-10 w-10 text-yellow-500" />,
//     },
//     {
//         name: "BMW E90",
//         type: "Sports / Gasoline",
//         maxDays: 7,
//         features: ["Turbo Engine", "Sport Mode", "GPS"],
//         pricePerDay: "$250",
//         icon: <Car className="h-10 w-10 text-yellow-500" />,
//     },
// ];


// // const iconVariants = {
// //     initial: { x: 0 },
// //     hover: { x: 40 },
// // };

// export default function CarsForRentSection() {

//     const { t } = useLanguage();

//     return (
//         // <section className="relative w-full py-24 px-6 bg-black/10 backdrop-blur-xl text-white">
//         <section className="relative w-full py-24 px-6 bg-muted/30 dark:bg-black/5 backdrop-blur-xs text-foreground">
//             <div className="max-w-6xl mx-auto text-center mb-16">
//                 <motion.h2
//                     initial={{ opacity: 0, y: 40 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.7 }}
//                     viewport={{ once: true }}
//                     className="lg:text-5xl text-lg font-bold mb-4"
//                 >
//                     {t("featuresTitle")}
//                     <span className="text-yellow-500 dark:text-yellow-500">{t("featuresTitleHighlighted")}</span>
//                 </motion.h2>
//                 <motion.p
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.7, delay: 0.2 }}
//                     viewport={{ once: true }}
//                     className="text-muted-foreground dark:text-white/60 text-lg"
//                 >
//                     {t("featuresSubtitle")}
//                 </motion.p>
//             </div>

//             <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto ">
//                 {cars.map((car, index) => (
//                     <motion.div
//                         key={index}
//                         initial="initial"
//                         whileHover="hover"
//                         className="bg-card dark:bg-black/30 group 
//                         hover:bg-accent/50 dark:hover:bg-purple-400/10 
//                         duration-500 border hover:cursor-pointer border-border
//                             dark:border-purple-400/20 hover:border-primary 
//                             dark:hover:border-purple-400/40 rounded-xl px-8 py-10 
//                             shadow-xl hover:shadow-2xl transition text-card-foreground"
//                     >
//                         <div className="flex items-center mb-4 space-x-3">
//                             <motion.span
//                                 initial={{ rotate: 0, y: 0, opacity: 1 }}
//                                 whileHover={{
//                                     rotate: [0, 15, -15, 0],       // icon rotates back and forth
//                                     y: [0, -5, 5, 0],              // icon moves up and down slightly
//                                     scale: [1, 1.1, 1, 1.05],      // small pulsation
//                                     transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
//                                 }}
//                                 className="inline-block relative"
//                             >
//                                 {car.icon}

//                                 {/* Optional “dust / particle” effect */}
//                                 <motion.span
//                                     className="absolute w-1 h-1 bg-yellow-400 rounded-full top-1 left-1 opacity-50"
//                                     initial={{ opacity: 0, x: 0, y: 0 }}
//                                     whileHover={{
//                                         opacity: [0, 0.5, 0],
//                                         x: [-5, 10, -10],
//                                         y: [-5, -10, 5],
//                                         transition: { duration: 1, repeat: Infinity },
//                                     }}
//                                 />
//                             </motion.span>


//                             <h3 className="text-2xl font-semibold text-card-foreground">{car.name}</h3>
//                         </div>

//                         <p className="text-muted-foreground dark:text-white/60 mb-2">{car.type}</p>

//                         <div className="flex items-center mb-2 text-muted-foreground dark:text-white/70 space-x-4">
//                             <Timer className="h-5 w-5 text-yellow-500" />
//                             <span>Max Rental: {car.maxDays} days</span>
//                         </div>

//                         <div className="flex items-center mb-2 text-muted-foreground dark:text-white/70 space-x-4">
//                             <Shield className="h-5 w-5 text-yellow-500" />
//                             <span>Features: {car.features.join(", ")}</span>
//                         </div>

//                         <div className="flex items-center text-muted-foreground dark:text-white/70 space-x-4">
//                             <Droplet className="h-5 w-5 text-yellow-500" />
//                             <span>Price: {car.pricePerDay} / day</span>
//                         </div>
//                     </motion.div>
//                 ))}
//             </div>
//         </section>
//     );
// }

///////////////////////////////////////////////////////////////////////////////////////////////////

"use client";

import { Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/app/language-provider";

const cars = [
    {
        name: "Tesla Model S",
        type: "Electric / Sedan",
        image:
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviews: 126,
        available: true,
        pricePerDay: 120,
    },
    {
        name: "Golf 7",
        type: "SUV / Gasoline",
        image:
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviews: 85,
        available: true,
        pricePerDay: 100,
    },
    {
        name: "BMW E90",
        type: "Sports / Gasoline",
        image:
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
        rating: 5.0,
        reviews: 42,
        available: false,
        pricePerDay: 250,
    },
];

export default function CarsForRentSection() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full py-24 px-6 bg-background text-foreground">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-3xl font-bold tracking-tight"
                        >
                            {t("featuresTitle")}
                            <span className="text-yellow-500">
                                {t("featuresTitleHighlighted")}
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-muted-foreground text-sm mt-1"
                        >
                            {t("featuresSubtitle")}
                        </motion.p>
                    </div>

                    <a
                        href="/fleet"
                        className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                        View all
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>

                {/* Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car, index) => (
                        <motion.div
                            key={car.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -4 }}
                            className="group rounded-2xl overflow-hidden border border-border
                            bg-card shadow-sm hover:shadow-xl hover:border-yellow-500/40
                            transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-44 overflow-hidden">
                                <Image
                                    src={car.image}
                                    alt={car.name}
                                    fill
                                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                    className="object-cover transition-transform
                                    duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-black/0" />

                                <span
                                    className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full
                                    ${car.available
                                            ? "bg-emerald-500/90 text-white"
                                            : "bg-zinc-700/90 text-zinc-200"
                                        }`}
                                >
                                    {car.available ? "Available" : "Booked"}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-lg font-semibold">{car.name}</h3>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <p className="text-sm text-muted-foreground">{car.type}</p>
                                    <span className="text-muted-foreground/40">•</span>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                        <span className="font-medium">{car.rating}</span>
                                        <span className="text-muted-foreground">
                                            ({car.reviews} reviews)
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <span className="text-xl font-bold text-yellow-500">
                                            ${car.pricePerDay}
                                        </span>
                                        <span className="text-sm text-muted-foreground">/day</span>
                                    </div>

                                    <motion.a
                                        href={`/fleet/${car.name.toLowerCase().replace(/\s+/g, "-")}`}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="h-9 w-9 flex items-center justify-center rounded-full
                                        bg-yellow-500 text-black hover:bg-yellow-400 transition-colors"
                                        aria-label={`View ${car.name} details`}
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </motion.a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile view-all link */}
                <div className="mt-8 flex justify-center sm:hidden">
                    <a
                        href="/fleet"
                        className="inline-flex items-center gap-1 text-sm font-medium text-yellow-500"
                    >
                        View all
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}