/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { deleteUserYourOrder } from "@/actions/cart"

interface Props {
    orderId: string
}

export function DeleteOrderButton({ orderId }: Props) {

    const handleDelete = async () => {
        try {
            await deleteUserYourOrder(orderId)
            toast.success("Order deleted")
        } catch (error: any) {
            toast.error(error.message ?? "Failed to delete order")
        }
    }

    return (
        <Button
            size="icon"
            variant="outline"
            onClick={handleDelete}
            className="bg-white/10 border-white/20 text-white
                    hover:bg-red-300 hover:text-red-500 hover:cursor-pointer"
        >
            <Trash size={18} />
        </Button>
    )
}
