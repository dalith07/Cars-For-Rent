"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompanyWithAll } from "@/lib/utils";
import { MapPin, SquareArrowOutUpRight, Car } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface CompanyProps {
    company: CompanyWithAll[];
}

const CompanyItemCars = ({ company }: CompanyProps) => {
    const [companyItems] = useState<CompanyWithAll[]>(company);

    // مؤشر السيارات لكل شركة
    const [carIndexes, setCarIndexes] = useState(
        company.map(() => 0)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCarIndexes((prev) =>
                prev.map((index, i) => {
                    const carsCount = companyItems[i].cars.length;
                    if (carsCount === 0) return 0;
                    return (index + 2) % carsCount; // زيادة بمقدار 2 بشكل دائري
                })
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [companyItems]);

    return (
        <div className="min-h-screen p-4 mt-32">
            {/* Companies Section */}
            <section className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    This <span className="text-primary/80">Company</span> In Market Cars
                </h1>
            </section>

            {/* Companies Cards */}
            <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {companyItems.map((c) => (
                    <Card
                        key={c.id}
                        className="group bg-primary/10 border border-primary/20 p-5 hover:border-primary/50 transition-all duration-500 rounded-2xl hover:shadow-yellow-500/20 hover:shadow-lg cursor-pointer"
                    >
                        <div className="grid text-white space-y-3">
                            <div className="w-full h-24 group relative">
                                <Image
                                    src={c.logo || "/logo-company.png"}
                                    alt={c.name}
                                    fill
                                    className="object-contain m-auto transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <h2 className="text-xl font-bold">{c.name.toLocaleUpperCase()}</h2>
                            <div className="text-sm text-gray-300 flex items-center gap-2">
                                <MapPin size={20} className="text-yellow-400/50 animate-pulse" />
                                {c.city}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-300 flex items-center gap-2">
                                    <Car size={20} className="text-primary animate-pulse" />
                                    {c.cars?.length ?? 0}
                                </div>
                                <Link href={`/company/${c.id}`}>
                                    <Button
                                        variant="outline"
                                        className="bg-transparent hover:text-white duration-500 hover:cursor-pointer hover:bg-primary/20 border-primary/20"
                                    >
                                        <SquareArrowOutUpRight />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Cars Section */}
            <section className="text-center mt-24">
                <h1 className="text-4xl md:text-5xl font-bold text-white">Cars</h1>
            </section>

            <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10">
                {companyItems.map((company, companyIdx) => {
                    const startIdx = carIndexes[companyIdx];
                    const carsCount = company.cars.length;

                    // اختيار أول سيارتين مع فلترة السيارات بنفس الاسم
                    const carsToShow: typeof company.cars = [];
                    const seenNames = new Set<string>();
                    for (let i = 0; i < carsCount && carsToShow.length < 2; i++) {
                        const car = company.cars[(startIdx + i) % carsCount];
                        if (!seenNames.has(car.name)) {
                            seenNames.add(car.name);
                            carsToShow.push(car);
                        }
                    }

                    return (
                        <div key={company.id} className="col-span-1">
                            <h2 className="text-xl font-bold text-white mb-3">{company.name} Cars</h2>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {carsToShow.map((car) => (
                                        <motion.div
                                            key={car.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Card className="relative p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center space-y-3">
                                                {/* Car Image */}
                                                <div className="w-full h-40 relative rounded-lg overflow-hidden">
                                                    <Image
                                                        src={car.images?.[0]?.imageUrl || "/logo-company.png"}
                                                        alt={car.name || "Car Image"}
                                                        fill
                                                        className="object-cover rounded-xl"
                                                    />
                                                </div>

                                                <h3 className="text-lg font-bold text-white">{car.name}</h3>

                                                <p className="text-sm text-gray-300">
                                                    {car.category?.name || "No Category"} • {car.year}
                                                </p>

                                                {/* Buttons */}
                                                <div className="flex gap-2 w-full mt-2">
                                                    <Button
                                                        className="flex-1 hover:bg-primary/20"
                                                        onClick={() => console.log("Add to cart:", car.id)}
                                                    >
                                                        Add to Cart
                                                    </Button>

                                                    <Link href={`/cars/${car.id}`} className="flex-1">
                                                        <Button variant="outline" className="w-full hover:bg-primary/20">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {carsCount > 2 && (
                                    <Link href={`/company/${company.id}`}>
                                        <Button className="w-full bg-primary/30 hover:bg-primary">View All Cars</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CompanyItemCars;
