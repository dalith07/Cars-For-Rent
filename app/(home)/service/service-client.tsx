"use client";

import { useLanguage } from "@/app/language-provider";
import MapSection from "@/components/map-center";
import { motion, } from "framer-motion";
import { Car, Clock, Users, Wrench } from "lucide-react";

const services = [
    { icon: Car, titleKey: "serviceCardWideSelectionTitle", descKey: "serviceCardWideSelectionDescription" },
    { icon: Clock, titleKey: "serviceCardFlexibleRentalsTitle", descKey: "serviceCardFlexibleRentalsDescription" },
    { icon: Wrench, titleKey: "serviceCardFullMaintenanceTitle", descKey: "serviceCardFullMaintenanceDescription" },
    { icon: Users, titleKey: "serviceCardCustomerSupportTitle", descKey: "serviceCardCustomerSupportDescription" },
];


type MapCompany = {
    name: string;
    lat: number;
    lng: number;
};

export default function ServiceClient({
    companies,
}: {
    companies: MapCompany[];
}) {

    const { t } = useLanguage();

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            {/* Background blur circles */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>

            <div className="relative z-10 mt-24 px-6 md:px-20 text-center text-white">
                {/* Header */}
                <motion.h1
                    initial={{ opacity: 0, y: -60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-5xl md:text-6xl text-purple-600 font-extrabold mb-4"
                >
                    {t("serviceTitle")}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    className="text-gray-300 max-w-xl mx-auto mb-16"
                >
                    {t("serviceSubtitle")}
                </motion.p>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-indigo-500/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                            >
                                {/* Animated Icon */}
                                <motion.div
                                    className="flex justify-center mb-4"
                                    animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "loop", // valid type
                                        ease: [0.42, 0, 0.58, 1], // cubic bezier for easeInOut
                                    }}
                                >
                                    <Icon className="w-12 h-12 text-indigo-400" />
                                </motion.div>
                                <h3 className="text-[1.4rem] font-semibold text-white mb-2">
                                    {t(service.titleKey)}
                                </h3>

                                <p className="text-gray-400 text-sm">
                                    {t(service.descKey)}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* <motion.h1
                    initial={{ opacity: 0, y: -60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-4xl md:text-5xl text-purple-600 font-extrabold mt-8"
                >
                    This Location Company In Maps
                </motion.h1> */}

                {/* MAP 🔥 */}
                <MapSection companies={companies} />
            </div>
        </div>
    );
};

