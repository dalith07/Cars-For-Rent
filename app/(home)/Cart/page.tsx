"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, CalendarDays, ArrowLeft, ShoppingBag } from "lucide-react"

import { useCart } from "@/lib/cart_context"
import { createOrder } from "@/actions/cart"
import { useCurrentUser } from "@/hooks/use-current-user"

export default function CartPage() {
    const router = useRouter()
    const { items, removeItem, clearCart } = useCart()
    const user = useCurrentUser()

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [loading, setLoading] = useState(false)

    // inside your component, update totalDays
    const totalDays =
        startDate && endDate
            ? Math.max(
                1,
                Math.ceil(
                    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
            )
            : 0

    // check if rental exceeds 7 days
    const isExceedMaxDays = totalDays > 7

    // السعر لكل سيارة بعد التخفيض
    const totalPrice = items.reduce((sum, car) => {
        if (!totalDays) return sum
        const priceAfterDiscount = car.pricePerDay * (1 - (car.discount ?? 0) / 100)
        return sum + priceAfterDiscount * totalDays
    }, 0)

    const TAX_RATE = 0.1
    const SERVICE_FEE = 20

    const subtotal = totalPrice
    const tax = subtotal * TAX_RATE
    const serviceFee = SERVICE_FEE
    const finalTotal = subtotal + tax + serviceFee

    const checkout = async () => {
        if (!user?.id) return toast.error("Please login first")
        if (!startDate || !endDate) return toast.error("Select rental dates")
        if (items.length === 0) return toast.error("Cart is empty")
        if (isExceedMaxDays) return toast.error("You cannot rent a car for more than 7 days")

        try {
            setLoading(true)

            await createOrder({
                userId: user.id,
                companyId: items[0].companyId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                cars: items.map((c) => ({
                    carId: c.id,
                    pricePerDay: c.pricePerDay,
                    discount: c.discount ?? 0,
                })),
            })

            clearCart()
            toast.success("Order placed successfully 🚗")
            router.push("/your-orders")
        } catch {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    // عرض الكارت فاضي
    if (items.length === 0) {
        return (
            <div className="min-h-screen container mx-auto px-4 py-16 flex items-center justify-center">
                <Card className="max-w-md w-full text-center bg-white/10 border-white/20">
                    <CardContent className="pt-6">
                        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-bold mb-2 text-white">Your cart is empty</h2>
                        <p className="text-muted-foreground mb-6">Add some products to get started!</p>
                        <Button asChild>
                            <Link href="/market-cars">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Continue Shopping
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen mt-32 mb-24 bg-primary/5 text-white">
            <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">

                {/* CART ITEMS */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((car) => {
                        const priceAfterDiscount = car.pricePerDay * (1 - (car.discount ?? 0) / 100)
                        // const totalCarPrice = priceAfterDiscount * totalDays
                        return (
                            <Card key={car.id} className="bg-primary/10 border border-primary/20">
                                <CardContent className="flex gap-4 p-4">
                                    <div className="relative md:w-40 md:h-28 w-32 h-16 rounded-lg overflow-hidden border border-primary/20">
                                        <Image
                                            src={car.images?.[0]?.imageUrl || ""}
                                            alt={car.name}
                                            fill
                                            className="object-cover hover:scale-110 duration-500"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-lg font-bold text-white">{car.name}</h3>

                                        <div className="flex gap-2 flex-wrap">
                                            <Badge className="bg-primary/20 text-white">{car.category.name}</Badge>
                                            <Badge variant="outline" className="border-primary/30 text-white">{car.model.name}</Badge>
                                            {car.discount! > 0 && (
                                                <Badge className="bg-red-600 text-white">-{car.discount}%</Badge>
                                            )}
                                        </div>

                                        <p className="text-sm text-white/70">
                                            {car.discount && car.discount > 0 ? (
                                                <>
                                                    <span className="line-through text-red-400 mr-2">
                                                        {car.pricePerDay} TND
                                                    </span>
                                                    <span className="text-green-400 font-bold">
                                                        {priceAfterDiscount.toLocaleString()} TND / day
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-yellow-400 font-semibold">
                                                    {car.pricePerDay.toLocaleString()} TND / day
                                                </span>
                                            )}
                                        </p>

                                        {/* {totalDays > 0 && (
                                            <p className="text-white font-bold">
                                                Total: {totalCarPrice.toLocaleString()} DT
                                            </p>
                                        )} */}
                                    </div>

                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeItem(car.id)}
                                    >
                                        <Trash2 />
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* SUMMARY */}
                <div className="space-y-6">
                    {/* Rental Dates */}
                    <Card className="bg-primary/10 border border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white text-lg">
                                <CalendarDays className="h-5 w-5 text-primary" />Rental Period
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                                <div className="flex-1">
                                    <Label className="text-white/80 text-sm mb-1 block">Start Date :</Label>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full bg-primary/20 border-primary/30 text-white focus:ring-1 focus:ring-primary"
                                    />
                                </div>

                                <div className="flex-1">
                                    <Label className="text-white/80 text-sm mb-1 block">End Date :</Label>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        max={
                                            startDate
                                                ? new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000)
                                                    .toISOString()
                                                    .split("T")[0]
                                                : undefined
                                        }
                                        className="w-full bg-primary/20 border-primary/30 text-white focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>


                            {startDate && endDate && (
                                <div className="text-sm text-primary/90 bg-primary/20 border border-primary/30 rounded-lg px-3 py-2 text-center">
                                    🗓️ Rental duration: <span className="font-bold text-white">{totalDays} days</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card className="bg-primary/10 border border-primary/20">
                        <CardContent className="space-y-3 pt-6">
                            <div className="flex justify-between text-white/80">
                                <span>Days</span>
                                <span>{totalDays}</span>
                            </div>
                            <div className="flex justify-between text-white/80">
                                <span>Subtotal</span>
                                <span>{subtotal.toLocaleString()} TND</span>
                            </div>
                            <div className="flex justify-between text-white/80">
                                <span>Tax (10%)</span>
                                <span>{tax.toLocaleString()} TND</span>
                            </div>
                            <div className="flex justify-between text-white/80">
                                <span>Service Fee</span>
                                <span>{serviceFee} TND</span>
                            </div>

                            <Separator className="bg-primary/20" />

                            <div className="flex justify-between text-lg font-bold text-green-400">
                                <span>Total</span>
                                <span>{finalTotal.toLocaleString()} TND</span>
                            </div>

                            <Button
                                disabled={loading || !startDate || !endDate}
                                onClick={checkout}
                                className="text-white w-full hover:cursor-pointer bg-primary/10 duration-500 hover:bg-primary/15 border border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : "Confirm Rental"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
