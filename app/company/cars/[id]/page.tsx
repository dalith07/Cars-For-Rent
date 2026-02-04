import { prisma } from "@/lib/prisma"
import { ItemsCarsWithAlll } from "@/lib/utils"
import { notFound } from "next/navigation"
import CarItems from "./car-items"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
    const carId = (await params).id;

    // Query for a car by ID, not a company
    const car = await prisma.car.findUnique({
        where: { id: carId },
        include: {
            category: true,
            model: true,
            images: true,
        }
    }) as ItemsCarsWithAlll | null;

    // console.log("Car data:", car);

    if (!car) return notFound();

    return <CarItems carsItems={car} />
}
