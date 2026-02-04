import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import ItemsCarsById from "./ItemsCarsById";
import { ItemsCarsWithAll } from "@/lib/utils";

interface SingleProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: SingleProductPageProps) {
    const Cars = (await prisma.car.findUnique({
        where: { id: (await params).id },

        include: {
            category: true,
            model: true,
            images: true,
            company: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                },
            },
        },
    })) as ItemsCarsWithAll;

    if (!Cars) {
        toast.error("Product Not Found")
        return notFound();
    }

    return (
        <div className="min-h-screen">
            <ItemsCarsById cars={Cars} />
        </div>
    );
}
