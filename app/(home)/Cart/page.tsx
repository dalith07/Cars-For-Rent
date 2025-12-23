/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    ArrowLeft,
    Mail,
} from "lucide-react"
import { useCart } from "@/lib/cart_context"
import { useOrders } from "@/lib/orders_context"
import { createUserCart } from "@/actions/cart"
import { useCurrentUser } from "@/hooks/use-current-user"

export default function CartPage() {
    const router = useRouter()
    const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart()

    // console.log("😍😉😉", items)
    const { refreshOrderCount } = useOrders()

    const user = useCurrentUser();

    useEffect(() => {
        if (user) {
            setCustomerName(user.name || "");
            setCustomerEmail(user.email || "");
            //   setPhoneNumber(user.. || "");
        }
    }, [user]);

    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [customerName, setCustomerName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [customerEmail, setCustomerEmail] = useState("")
    const [country, setCountry] = useState("")
    const [customerAddress, setCustomerAddress] = useState("")

    const subtotal = getTotalPrice()
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 50 ? 0 : 9.99 // Free shipping over $50
    const total = subtotal + tax + shipping

    // ✅ FIXED CHECKOUT FUNCTION
    const handleCheckout = async () => {
        if (!customerName.trim() || !customerEmail.trim() || !customerAddress.trim()) {
            toast.error("Please fill in all customer information")
            return
        }
        if (items.length === 0) {
            toast.error("Your cart is empty")
            return
        }

        try {
            setIsCheckingOut(true)

            const result = await createUserCart({
                userId: user?.id,
                customerName: customerName,
                customerEmail: customerEmail,
                phoneNumber: phoneNumber,
                country: country,
                shippingAddress: customerAddress,
                subtotal: subtotal,
                tax: tax,
                shipping: shipping,
                total: total,
                items: items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description || "",
                    price: item.price,
                    quantity: item.quantity,
                    discount: item.discount || 0,
                    image: item.imagesOnCars?.[0]?.imageUrl,
                    category: item.category?.name,            // 🔥 FIX expects string
                    model: item.model?.name,
                })),
            });

            if (result.success) {
                toast.success(result.message);
            } else if (!result.success) {
                toast.error(result.message)
            }


            clearCart()
            await refreshOrderCount()
            router.push("/your-orders")
        } catch (error: any) {
            console.error("Checkout error: 😭😭", error)
            toast.error(error || "An error occurred during checkout")
        } finally {
            setIsCheckingOut(false)
        }
    }

    // ✅ Empty cart display
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
    // ✅ Main cart UI
    return (
        <>
            <div className="min-h-screen mt-32">

                <section className="py-12 px-4 bg-white/5 rounded-full">
                    <div className="container mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Shopping Cart</h1>
                        <p className="text-yellow-500/70">
                            {items.length} {items.length === 1 ? "Item" : "Items"} in your cart
                        </p>
                    </div>
                </section>

                <section className="py-8 px-4">
                    <div className="container mx-auto">
                        <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-white">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Continue Shopping
                        </Button>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                <Card className="bg-white/5 border-white/20">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-white">Cart Items ({items.length})</CardTitle>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={clearCart}
                                            className="hover:cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Clear Cart
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {items.map((item) => {
                                            const itemPrice = item.discount
                                                ? item.price * (1 - item.discount / 100)
                                                : item.price
                                            const itemTotal = itemPrice * item.quantity

                                            return (
                                                <div key={item.id}>
                                                    <div className="flex gap-4">
                                                        <div className="relative w-40 h-26 shrink-0 rounded-lg bg-white/10 border border-white/20">
                                                            <Image
                                                                src={item.imagesOnCars?.[0].imageUrl || ""}
                                                                alt={"image car"}
                                                                fill
                                                                className="object-cover rounded-lg duration-500 hover:scale-150 hover:cursor-pointer"
                                                            />
                                                        </div>

                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h3 className="font-semibold line-clamp-1 text-white">{item.name}</h3>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Badge variant="secondary" className="text-xs border-white/20">
                                                                            {item.category.name}
                                                                        </Badge>
                                                                        <Badge variant="outline" className="text-xs border-white/20 text-white">
                                                                            {item.model.name}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="bg-transparent border-white/20 hover:text-red-500 text-white hover:bg-red-500/50 hover:cursor-pointer"
                                                                    onClick={() => removeItem(item.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-8 w-8 hover:scale-110 text-white bg-transparent hover:bg-destructive hover:text-white hover:cursor-pointer border-white/20"
                                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                        disabled={item.quantity <= 1}
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                    </Button>

                                                                    <span className="w-12 text-center font-semibold bg-white/10 rounded-lg text-white">{item.quantity}</span>

                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-8 w-8 hover:scale-110 bg-transparent hover:bg-green-900 hover:text-white hover:cursor-pointer text-white border-white/20"
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                        disabled={item.quantity >= item.quantity}
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </Button>

                                                                    <span className="text-xs text-muted-foreground ml-2">
                                                                        Max: {item.quantity}
                                                                    </span>
                                                                </div>

                                                                <div className="text-right">
                                                                    <div className="flex items-center gap-2">
                                                                        {item.discount ? (
                                                                            <>
                                                                                <span className="text-lg font-bold text-white">
                                                                                    {(item.price ?? 0)
                                                                                        .toString()
                                                                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                                                                    DT
                                                                                </span>
                                                                                <span className="text-sm text-red-500/90 line-through">
                                                                                    {(item.price ?? 0)
                                                                                        .toString()
                                                                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                                                                    DT
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <span className="text-lg font-bold">
                                                                                {(item.price ?? 0)
                                                                                    .toString()
                                                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                                                                DT
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm font-bold text-green-500 animate-bounce">
                                                                        {(itemTotal ?? 0)
                                                                            .toString()
                                                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                                                        DT
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Separator className="mt-4 border-white/20" />
                                                </div>
                                            )
                                        })}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Summary + Checkout */}
                            <div className="space-y-6">
                                <Card className="bg-white/10 border-white/20">
                                    <CardHeader>
                                        <CardTitle className="text-white">Customer Information</CardTitle>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-white">Full Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="John Doe"
                                                value={customerName}
                                                className="bg-white/10 border-white/20 text-white"
                                                onChange={(e) => setCustomerName(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-white">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                type="number"
                                                placeholder="55 555 555"
                                                value={phoneNumber}
                                                className="bg-white/10 border-white/20 text-white"
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-white">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={customerEmail}
                                                className="bg-white/10 border-white/20 text-white"
                                                onChange={(e) => setCustomerEmail(e.target.value)}
                                            />
                                            <p className="text-xs text-yellow-500 animate-pulse opacity-90 mb-2 flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                Order confirmation will be sent here
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="Country" className="text-white">Your Country</Label>
                                            <Input
                                                id="country"
                                                placeholder="Enter Your Country (mahdia)"
                                                value={country}
                                                className="bg-white/10 border-white/20 text-white"
                                                onChange={(e) => setCountry(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-white">Shipping Address</Label>
                                            <Input
                                                id="address"
                                                placeholder="123 Main St"
                                                value={customerAddress}
                                                className="bg-white/10 border-white/20 text-white"
                                                onChange={(e) => setCustomerAddress(e.target.value)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Order Summary */}
                                <Card className="bg-white/10 border-white/20">
                                    <CardHeader>
                                        <CardTitle className="text-white">Order Summary</CardTitle>
                                        <CardDescription className="text-gray-400">Review your order details</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Subtotal</span>
                                            <span className="text-white">
                                                {(subtotal)
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                                DT
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Shipping</span>
                                            <span className="text-white">{shipping === 0 ? "FREE" : `$${(shipping).toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}}`}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Tax (10%)</span>
                                            <span className="text-white">{tax.toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} DT</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-white">Total</span>
                                            <span className="text-green-200 animate-bounce">{total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} DT</span>
                                        </div>
                                        <Button className="w-full text-white hover:cursor-pointer" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                                            {isCheckingOut ? "Processing..." : "Place Order"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

