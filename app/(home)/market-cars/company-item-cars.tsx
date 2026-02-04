"use client";
import { Card } from "@/components/ui/card";
import { CompanyWithAll } from "@/lib/utils";
import { Car, Loader2, MapPin } from "lucide-react"
import Image from "next/image";
import { useState } from "react";

interface CompanyProps {
    company: CompanyWithAll[]
}

const CompanyItemCars = ({ company }: CompanyProps) => {
    const [companyItems] = useState<CompanyWithAll[]>(company);
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen p-4 mt-32">
            <section className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    This <span className="text-primary/80">Company</span> In Market Cars
                </h1>
            </section>

            <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {loading ? (
                    <div className="col-span-full flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-gray-300">Loading companies...</span>
                    </div>
                ) : companyItems.length === 0 ? (
                    <p className="text-white col-span-full text-center">No companies found.</p>
                ) : (
                    companyItems.map((c) => (
                        <Card
                            key={c.id}
                            className="group bg-primary/10 border border-primary/20 p-5 
                            hover:border-primary/50 transition-all duration-500 
                            rounded-2xl hover:shadow-yellow-500/20 hover:shadow-lg cursor-pointer"
                        >
                            <div className="text-white space-y-3">
                                <div className="w-full h-24 group">
                                    <Image
                                        src={c.logo || "/logo-company.png"}
                                        alt="image car"
                                        width={100}
                                        height={100}
                                        className="m-auto object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <h2 className="text-xl font-bold">{c.name.toLocaleUpperCase()}</h2>

                                <div className="text-sm text-gray-300 flex items-center gap-2">
                                    <MapPin size={20} className="text-yellow-400/50 animate-pulse" /> {c.city}
                                </div>

                                <div className="text-sm text-gray-300 flex items-center gap-2">
                                    <Car size={20} className="text-primary animate-pulse" /> {c.cars?.length ?? 0}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

export default CompanyItemCars;
