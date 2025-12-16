import { getCarsById } from "@/data/cars";
import CarItems from "./car-items";

interface PageProps {
    params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
    const carsItems = await getCarsById((await params).id);

    if (!carsItems) {
        return <div className="min-h-screen flex items-center justify-center ">
            <p className="p-6 text-center bg-destructive/80 rounded-lg text-red-100">Car not found</p>
        </div>;
    }

    return (
        <CarItems carsItems={carsItems} />)
}

export default page
