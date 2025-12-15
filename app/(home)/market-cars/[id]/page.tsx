import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import ItemsCarsById from "./ItemsCarsById";
import { ItemsCarsWithAll } from "@/lib/utils";

interface SingleProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: SingleProductPageProps) {
    const Cars = (await prisma.itemsCars.findUnique({
        where: { id: (await params).id },

        include: {
            category: true,
            model: true,
            imagesOnCars: true,
        },
    })) as ItemsCarsWithAll;

    if (!Cars) {
        toast.error("Product Not Found")
        return notFound();
    }

    console.log(Cars)

    return (
        <div className="min-h-screen">
            <ItemsCarsById cars={Cars} />
        </div>
    );
}
