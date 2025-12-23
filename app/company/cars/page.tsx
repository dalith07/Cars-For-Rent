"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

import { CompanySidebar } from "@/components/company/company-sidebar"
import { PageHeader } from "@/components/company/page-header"

// Mock data for cars
const mockCars = [
    { id: 1, name: "Tesla Model 3", make: "Tesla", model: "Model 3", year: 2023, status: "Available", rentals: 12 },
    { id: 2, name: "BMW 5 Series", make: "BMW", model: "5 Series", year: 2023, status: "Rented", rentals: 8 },
    { id: 3, name: "Audi A4", make: "Audi", model: "A4", year: 2022, status: "Available", rentals: 15 },
    {
        id: 4,
        name: "Mercedes C-Class",
        make: "Mercedes",
        model: "C-Class",
        year: 2023,
        status: "Maintenance",
        rentals: 6,
    },
    { id: 5, name: "Toyota Camry", make: "Toyota", model: "Camry", year: 2022, status: "Available", rentals: 20 },
    { id: 6, name: "Honda Accord", make: "Honda", model: "Accord", year: 2021, status: "Available", rentals: 18 },
]
export default function MyCarsPage() {
    return (
        <SidebarProvider>
            <CompanySidebar />

            <SidebarInset>
                <PageHeader />

                <main className="flex-1 overflow-auto">
                    <div className="p-4 md:p-8">
                        <div className="mb-8 flex items-center justify-between">
                            <Link href="/company/cars/new">
                                <Button>Add New Car</Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {mockCars.map((car) => (
                                <Card key={car.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle>{car.name}</CardTitle>
                                        <CardDescription>
                                            {car.year} • {car.make}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {/* content */}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
