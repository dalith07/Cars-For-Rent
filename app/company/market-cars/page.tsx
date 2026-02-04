"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { CompanyHeader } from "@/components/company/company-header"

const marketCars = [
    {
        id: 1,
        name: "Porsche 911",
        type: "Sports",
        year: 2024,
        price: "$300/day",
        company: "Luxury Motors",
        location: "San Francisco",
        image: "/porsche-911-classic.png",
    },
    {
        id: 2,
        name: "Range Rover Sport",
        type: "SUV",
        year: 2023,
        price: "$220/day",
        company: "Elite Rentals",
        location: "Los Angeles",
        image: "/range-rover-sport.png",
    },
    {
        id: 3,
        name: "Lamborghini Huracán",
        type: "Sports",
        year: 2024,
        price: "$850/day",
        company: "Dream Cars",
        location: "Miami",
        image: "/lamborghini-huracan.jpg",
    },
    {
        id: 4,
        name: "Tesla Model S",
        type: "Electric",
        year: 2024,
        price: "$180/day",
        company: "Green Drive",
        location: "Seattle",
        image: "/tesla-model-s.png",
    },
    {
        id: 5,
        name: "Ford Mustang",
        type: "Sports",
        year: 2023,
        price: "$150/day",
        company: "American Muscle",
        location: "Dallas",
        image: "/classic-mustang.png",
    },
    {
        id: 6,
        name: "Jeep Wrangler",
        type: "SUV",
        year: 2023,
        price: "$120/day",
        company: "Adventure Rentals",
        location: "Denver",
        image: "/rugged-jeep-adventure.png",
    },
]

export default function MarketCarsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [locationFilter, setLocationFilter] = useState("all")

    const filteredCars = marketCars.filter((car) => {
        const matchesSearch =
            car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.company.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = typeFilter === "all" || car.type === typeFilter
        const matchesLocation = locationFilter === "all" || car.location === locationFilter
        return matchesSearch && matchesType && matchesLocation
    })

    return (
        <div className="flex flex-1 flex-col">
            <CompanyHeader title="Market Cars" description="Browse and purchase vehicles from other companies" />
            <main className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{filteredCars.length} vehicles available in the market</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by car name or company..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                            <SelectItem value="Electric">Electric</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            <SelectItem value="San Francisco">San Francisco</SelectItem>
                            <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                            <SelectItem value="Miami">Miami</SelectItem>
                            <SelectItem value="Seattle">Seattle</SelectItem>
                            <SelectItem value="Dallas">Dallas</SelectItem>
                            <SelectItem value="Denver">Denver</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCars.map((car) => (
                        <Card key={car.id}>
                            <CardHeader className="p-0">
                                <Image
                                    width={100}
                                    height={100}
                                    src={car.image || "/placeholder.svg"}
                                    alt={car.name}
                                    className="h-48 w-full rounded-t-lg object-cover"
                                />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{car.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {car.type} • {car.year}
                                        </p>
                                    </div>
                                    <Badge variant="secondary">{car.location}</Badge>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">by {car.company}</p>
                                <p className="mt-4 text-xl font-bold">{car.price}</p>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button className="flex-1">Purchase</Button>
                                <Button variant="outline" className="flex-1 bg-transparent">
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}
