/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, AlertCircle, Check, RefreshCw, Shield, Truck, ShoppingCart, Plus, Minus, ChevronLeft, Share2, Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ItemsCarsWithAll } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart_context";
import { Lens } from "@/components/ui/lens";

interface ProductPageProps {
    cars: ItemsCarsWithAll;
}

export default function ProductDetailPage({ cars }: ProductPageProps) {
    const { addItem } = useCart();
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const cardRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    const handleQuantityChange = (action: "increase" | "decrease") => {
        if (action === "increase" && cars && quantity < cars.stock) {
            setQuantity(quantity + 1);
        } else if (action === "decrease" && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    useEffect(() => {
        if (cardRef.current) {
            gsap.from(cardRef.current, { opacity: 0, y: 50, duration: 1, ease: "power3.out" });
        }
        if (bgRef.current) {
            gsap.to(bgRef.current, { backgroundPosition: "200% 0%", duration: 20, repeat: -1, ease: "linear" });
        }
    }, []);

    const handleAddToCart = () => {
        if (!cars) return;

        // addItem({
        //     id: cars.id,
        //     name: cars.name,
        //     pricePerDay: cars.pricePerDay,
        //     discount: cars.discount,
        //     images: cars.images ?? [],
        //     category: { id: cars.category?.id ?? "unknown", name: cars.category?.name ?? "Unknown" },
        //     model: { id: cars.model?.id ?? "unknown", name: cars.model?.name ?? "Unknown" },
        //     stock: quantity, // stock in cart, not DB stock
        //     description: cars.description,
        // });

        addItem(cars, quantity);

        toast.success(`Added ${quantity} ${cars.name} to cart`);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: cars.name, text: cars.name, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    const discountedPrice =
        cars?.discount && cars.pricePerDay
            ? cars.pricePerDay * (1 - cars.discount / 100)
            : null;

    const inStock = (cars?.stock ?? 0) > 0 && cars.status !== "RENTED" && cars.status !== "MAINTENANCE";

    const renderStars = (rating: number) =>
        Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
            />
        ));

    if (!cars) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Product Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">The cars you are looking for doesn’t exist.</p>
                    <Button asChild>
                        <Link href="/MarketPlace">Back to Marketplace</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-20 bg-primary/5 dark:bg-gray-900" ref={bgRef}>
            {/* Breadcrumb */}
            <section className="py-4 px-4 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200 duration-500">
                            Home
                        </Link>
                        <span>/</span>
                        <Link href="/market-cars" className="hover:text-gray-700 dark:hover:text-gray-200 duration-500">
                            Marketplace
                        </Link>
                        <span>/</span>
                        <Link
                            href={`/market-cars?category=${cars.category.name}`}
                            className="hover:text-gray-700 dark:hover:text-gray-200 duration-500"
                        >
                            {cars.category.name}
                        </Link>
                        <span>/</span>
                        <span className="text-primary/80">{cars.name}</span>
                    </div>
                </div>
            </section>

            {/* Product Details */}
            <section className="py-8 px-4">
                <div className="container mx-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="mb-6 hover:cursor-pointer border-primary/20 bg-primary/10 text-gray-900 hover:bg-primary/20 hover:text-gray-900 dark:text-white dark:hover:text-white duration-500"                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {/* Product Images */}
                        <div className="space-y-4">
                            {/* <Card className="overflow-hidden dark:bg-gray-900 dark:border-gray-700 bg-primary/20 border border-primary/30">
                                <CardContent className="p-0">
                                    <div className="relative aspect-square">
                                        <Image
                                            src={cars.images[selectedImage]?.imageUrl || "/placeholder.svg"}
                                            alt={cars.name}
                                            fill
                                            className="object-cover"
                                            priority
                                        />

                                        {cars.discount && cars.discount > 0 && (
                                            <Badge className="absolute top-4 right-4 bg-red-500 text-white text-lg">
                                                -{cars.discount}%
                                            </Badge>
                                        )}
                                        {!inStock && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <Badge className="bg-red-500 text-white text-lg py-2 px-4">Out of Stock</Badge>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card> */}

                            <Card className="overflow-hidden dark:bg-gray-900 dark:border-gray-700 bg-primary/20 border border-primary/30">
                                <CardContent className="p-0">
                                    <div className="relative w-full h-90"> {/* حجم الصورة فقط */}

                                        <Lens
                                            zoomFactor={2}
                                            lensSize={120}
                                            isStatic={false}
                                            ariaLabel="Zoom car image"
                                        >
                                            <img
                                                src={cars.images[selectedImage]?.imageUrl || "/placeholder.svg"}
                                                alt={cars.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </Lens>

                                        {cars.discount && cars.discount > 0 && (
                                            <Badge className="absolute top-4 right-4 bg-red-500 text-white text-lg z-10">
                                                -{cars.discount}%
                                            </Badge>
                                        )}

                                        {!inStock && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                                <Badge className="bg-red-500 text-white text-lg py-2 px-4">
                                                    Out of Stock
                                                </Badge>
                                            </div>
                                        )}

                                    </div>
                                </CardContent>
                            </Card>

                            {/* Thumbnail Images */}
                            {cars.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {cars.images.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative aspect-square rounded-lg overflow-hidden dark:bg-gray-900 bg-primary/10 border-2 transition-all ${selectedImage === index ? "border-primary/10 ring-primary/50 dark:border-gray-700 ring-2 dark:ring-gray-700" : "border-gray-300 dark:border-gray-700"}`}
                                        >
                                            <Image
                                                src={image.imageUrl || ""}
                                                alt={`${cars.name} ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{cars.name}</h1>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-1">{renderStars(4.8)}</div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">4.8 (128 reviews)</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">256 sold</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setIsFavorite(!isFavorite)}
                                            className={`
    cursor-pointer
    bg-white text-gray-700 border-gray-300
    hover:bg-gray-100

    dark:bg-primary/10 dark:border-primary/20 dark:text-white
    dark:hover:bg-primary/15

    ${isFavorite ? "text-red-500" : ""}
  `}
                                        >
                                            <Heart
                                                className={`h-5 w-5 ${isFavorite ? "fill-red-500" : "fill-none"}`}
                                            />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleShare}
                                            className="
    cursor-pointer
    bg-white text-gray-700 border-gray-300
    hover:bg-gray-100

    dark:bg-primary/10 dark:border-primary/20 dark:text-white
    dark:hover:bg-primary/15
  "
                                        >
                                            <Share2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <Badge
                                        className="text-sm
                                            bg-gray-100 text-gray-800 border border-gray-300
                                            dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                                    >
                                        {cars.category.name}
                                    </Badge>

                                    <Badge
                                        className=" text-sm
                                            bg-gray-100 text-gray-800 border border-gray-300
                                            dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                                    >
                                        {cars.model.name}
                                    </Badge>

                                    <Badge
                                        className={`text-sm ${inStock
                                            ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-800/20 dark:text-green-300"
                                            : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-800/20 dark:text-red-300"
                                            }`}
                                    >
                                        {inStock ? `In Stock (${cars.stock})` : "Out of Stock"}
                                    </Badge>
                                </div>

                                <div className="flex items-baseline gap-3 mb-6">
                                    {discountedPrice ? (
                                        <>
                                            <span className="xl:text-4xl md:text-xl text-lg font-bold text-primary">
                                                {discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TND
                                            </span>
                                            <span className="text-xl text-gray-500 dark:text-gray-400 line-through -translate-x-2 -translate-y-4">
                                                {(cars.pricePerDay ?? 0)} TND
                                            </span>
                                            <Badge variant="destructive" className="text-sm">
                                                Save {(cars.pricePerDay ?? 0) - discountedPrice} TND
                                            </Badge>
                                        </>
                                    ) : (
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                            {(cars.pricePerDay ?? 0)} TND
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Quantity & Actions */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-white">Quantity</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-primary/20 rounded-lg overflow-hidden">

                                            {/* Decrease */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleQuantityChange("decrease")}
                                                disabled={quantity <= 1 || !inStock}
                                                className={`
      rounded-r-none
      bg-white text-gray-700 border-none
      hover:bg-gray-100 hover:text-gray-900
      dark:bg-transparent dark:text-white dark:hover:text-white
      cursor-pointer
    `}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>

                                            {/* Quantity Display */}
                                            <div className="
    px-6 py-2 font-semibold
    bg-gray-100 text-gray-900
    dark:bg-primary/30 dark:text-white
    min-w-[60px] text-center
  ">
                                                {quantity}
                                            </div>

                                            {/* Increase */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleQuantityChange("increase")}
                                                disabled={quantity >= cars.stock || !inStock}
                                                className={`
      rounded-l-none
      bg-white text-gray-700 border-none
      hover:bg-gray-100 hover:text-gray-900
      dark:bg-transparent dark:text-white dark:hover:text-white
      cursor-pointer
    `}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {inStock && <span className="text-sm text-gray-500 dark:text-gray-400">{cars.stock} Available</span>}
                                        {quantity >= cars.stock && (
                                            <span className="text-sm text-red-500 mt-1 dark:text-red-400 opacity-80">Maximum stock reached</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button size="lg" className="flex-1 md:text-lg hover:cursor-pointer" onClick={handleAddToCart} disabled={!inStock}>
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        {inStock ? "Add to Cart" : "Out of Stock"}
                                    </Button>

                                    <Button size="lg" variant="outline" className="flex-1 md:text-lg hover:bg-primary/15 duration-500 bg-primary/10 border-primary/20 dark:text-white text-black hover:text-white hover:cursor-pointer" disabled={!inStock}>
                                        Buy Now
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-4">

                                <Card className="border-dashed border-primary/20 bg-gray-100 dark:bg-gray-800">
                                    <CardContent className="p-4 text-center">
                                        <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Free Shipping</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 opacity-80">On Orders Over 20 TND</p>
                                    </CardContent>
                                </Card>

                                <Card className="border-dashed border-primary/20 bg-gray-100 dark:bg-gray-800">
                                    <CardContent className="p-4 text-center">
                                        <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Warranty</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 opacity-80">Insurance Guarantee</p>
                                    </CardContent>
                                </Card>

                                <Card className="border-dashed border-primary/20 bg-gray-100 dark:bg-gray-800">
                                    <CardContent className="p-4 text-center">
                                        <RefreshCw className="h-8 w-8 mx-auto mb-2 text-primary animate-spin" />
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Easy Returns</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 opacity-80">3 Days Return</p>
                                    </CardContent>
                                </Card>

                            </div>

                        </div>
                    </div>

                    <Tabs defaultValue="description" className="mb-12">
                        {/* Tabs List */}
                        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                            <TabsTrigger
                                value="description"
                                className="text-gray-800 dark:text-gray-200 data-[state=active]:bg-primary/15"
                            >
                                Description
                            </TabsTrigger>
                            <TabsTrigger
                                value="specifications"
                                className="text-gray-800 dark:text-gray-200 data-[state=active]:bg-primary/15"
                            >
                                Specifications
                            </TabsTrigger>
                            <TabsTrigger
                                value="reviews"
                                className="text-gray-800 dark:text-gray-200 data-[state=active]:bg-primary/15"
                            >
                                Reviews (128)
                            </TabsTrigger>
                        </TabsList>

                        {/* Description Tab */}
                        <TabsContent value="description" className="mt-6">
                            <Card className="bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-gray-800 dark:text-gray-200">Product Description</CardTitle>
                                </CardHeader>
                                <CardContent className="prose max-w-none">
                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{cars.description}</p>

                                    <h3 className="text-lg text-gray-800 dark:text-gray-200 font-semibold mt-6 mb-3">Key Features:</h3>
                                    <ul className="space-y-2 text-gray-800 dark:text-gray-300">
                                        {[
                                            "Premium quality materials and construction",
                                            "Advanced technology for superior performance",
                                            "Sleek and modern design that fits any style",
                                            "Energy efficient and environmentally friendly"
                                        ].map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Specifications Tab */}
                        <TabsContent value="specifications" className="mt-6">
                            <Card className="bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-gray-800 dark:text-gray-200">Technical Specifications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6 text-gray-800 dark:text-gray-200">
                                        {/* Left Column */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-700">
                                                <span className="font-medium">Category</span>
                                                <span>{cars.category.name}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-700">
                                                <span className="font-medium">Model</span>
                                                <span>{cars.model.name}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-700">
                                                <span className="font-medium">Status</span>
                                                <Badge className="bg-gray-200 text-green-600 dark:bg-gray-800 dark:text-green-300">{cars.status}</Badge>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-700">
                                                <span className="font-medium">Product ID</span>
                                                <span className="font-mono text-xs">{cars.id}</span>
                                            </div>
                                        </div>
                                        {/* Right Column */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-700">
                                                <span className="font-medium">Availability</span>
                                                <span>{cars.stock} in stock</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-700">
                                                <span className="font-medium">Weight</span>
                                                <span>1.2 kg</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-700">
                                                <span className="font-medium">Dimensions</span>
                                                <span>15 x 10 x 5 cm</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-700">
                                                <span className="font-medium">Warranty</span>
                                                <span>1 Year</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Reviews Tab */}
                        <TabsContent value="reviews" className="mt-6">
                            <Card className="bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-gray-800 dark:text-gray-200">Customer Reviews</CardTitle>
                                    <CardDescription className="text-gray-500 dark:text-gray-400">
                                        See what our customers are saying about this car
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {/* Review Summary */}
                                        <div className="flex items-center gap-8 p-6 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                            <div className="text-center">
                                                <div className="xl:text-5xl md:text-lg text-[1rem] font-bold mb-2 text-gray-800 dark:text-gray-200">4.8</div>
                                                <div className="flex items-center gap-1 mb-1">{renderStars(4.8)}</div>
                                                <p className="text-sm text-gray-500 dark:text-gray-300">Based on 128 reviews</p>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                {[5, 4, 3, 2, 1].map((rating) => (
                                                    <div key={rating} className="flex items-center gap-3">
                                                        <span className="text-sm w-12">{rating} star</span>
                                                        <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-yellow-400"
                                                                style={{ width: `${rating === 5 ? 75 : rating === 4 ? 20 : 5}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm w-12 text-right text-gray-500 dark:text-gray-300">
                                                            {rating === 5 ? "96" : rating === 4 ? "25" : "7"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Sample Reviews */}
                                        <div className="space-y-6">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-semibold text-gray-800 dark:text-gray-200">John Doe</span>
                                                                <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center gap-1">{renderStars(5)}</div>
                                                                <span className="text-sm text-gray-500 dark:text-gray-300">2 days ago</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        Excellent car! The quality exceeded my expectations. Fast shipping and great customer service. Highly recommended!
                                                    </p>
                                                    <Separator />
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            variant="outline"
                                            className="w-full bg-gray-200 border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 hover:bg-primary/15 hover:text-white"
                                        >
                                            Load More Reviews
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </div>
    );
}
