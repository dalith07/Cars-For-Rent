/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect, useRef } from "react"
import { Car, Handshake, House, Menu, MessagesSquare, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import clsx from "clsx";
import { usePathname } from "next/navigation"
import gsap from "gsap";
import AuthToggle from "./auth-toggle"
import { useCurrentUser } from "@/hooks/use-current-user"
import { signOut } from "next-auth/react"
import { useCart } from "@/lib/cart_context"
import { getOrderCount } from "@/actions/cart"
import LanguageSwitcher from "./LanguageSwitcher"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [currentTextIndex, setCurrentTextIndex] = useState(0)

    const [orderCount, setOrderCount] = useState(0);

    const pathname = usePathname();
    const titleRef = useRef<HTMLSpanElement>(null);

    const user = useCurrentUser();


    // Array of text and image elements
    const texts = [
        <span key="text1">Cars For Rent</span>,
        <span key="text2">سيارات للإيجار</span>
    ];

    // Rotate title every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Animate fade in/out with GSAP whenever text changes
    useEffect(() => {
        if (!titleRef.current) return;
        gsap.fromTo(
            titleRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        );
    }, [currentTextIndex]);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const { getTotalItems } = useCart()
    const totalItems = getTotalItems()

    // Count orders for this user

    useEffect(() => {
        if (!user?.id) return;

        const fetchOrderCount = async () => {
            const count = await getOrderCount(user.id);
            setOrderCount(count);
        };

        fetchOrderCount();
    }, [user?.id]);

    const playSound = () => {
        const audio = new Audio("/sounds/sound_car.mp3");
        audio.volume = 0.5;
        audio.play().catch((err) => console.log("Audio error:", err));
    };

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-black/70 backdrop-blur-md"
                : "bg-black/30 backdrop-blur-md"
                }`}
        >
            <nav className="container mx-auto sm:px-2 px-4 py-4 flex items-center justify-between">
                {/* LOGO NAV-BAR */}
                <div>
                    <Link href={"/"} className="text-white text-sm md:text-lg font-bold">
                        <span ref={titleRef} className="inline-block">
                            {texts[currentTextIndex]}
                        </span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className={clsx(
                                "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3",
                                pathname === "/" ? "text-blue-500" : "hover:text-blue-500 text-white"
                            )}
                        >
                            <House className="mr-1 w-5 h-5" />
                            Home
                        </Link>

                        <Link
                            href="/market-cars"
                            className={clsx(
                                "inline-flex text-white items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 ",
                                pathname === "/MarketCars" ? "text-blue-500" : "hover:text-blue-500 text-white"
                            )}
                        >
                            <Car className="mr-1 w-5 h-5" />
                            Market Cars
                        </Link>

                        <Link
                            href="/Service"
                            className={clsx(
                                "inline-flex text-white items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3",
                                pathname === "/Service" ? "text-blue-500" : "hover:text-blue-500"
                            )}
                        >
                            <Handshake className="mr-1 w-5 h-5" />
                            Service
                        </Link>
                        <div className="h-8 w-px bg-zinc-200 hidden sm:block"></div>

                        <Link
                            href="/your-orders"
                            className={clsx(
                                "inline-flex text-white items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  h-8 rounded-md px-3 relative",
                                pathname === "/UserOrdres" ? "text-blue-500" : "hover:text-blue-500"
                            )}
                        >
                            <span className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                {orderCount ? orderCount : 0}
                            </span>
                            <ShoppingCart className="mr-1 w-5 h-5" />
                            Your Orders
                        </Link>

                        {/* <Link
                            href="/notifications"
                            className={clsx(
                                "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs",
                                pathname === "/" ? "text-blue-500" : "hover:text-blue-500 text-white"
                            )}
                        >
                            <MessagesSquare className="mr-1 w-5 h-5" />
                            Notification
                        </Link> */}
                    </div>
                </div>

                {/* CARD & LANGUAGE */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/Cart" >
                        <button className="relative text-blue-500 p-4 rounded-full border hover:cursor-pointer border-blue-500/20 bg-blue-500/20 duration-500 hover:bg-blue-500/10">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-2 -right-1 bg-blue-500 text-white rounded-full text-[14px] w-6 h-6 flex items-center justify-center">
                                {totalItems > 0 ? <>{totalItems}</> : <>0</>}
                            </span>
                        </button>
                    </Link>

                    <Link href="/Cart" >
                        <button className="relative text-primary p-4 rounded-full border hover:cursor-pointer border-yellow-500/20 bg-yellow-500/20 duration-500 hover:bg-yellow-500/10">
                            <MessagesSquare size={20} />
                            <span className="absolute -top-2 -right-1 bg-yellow-500 text-white rounded-full text-[14px] w-6 h-6 flex items-center justify-center">
                                {/* {totalItems > 0 ? <>{totalItems}</> : <>0</>} */}0
                            </span>
                        </button>
                    </Link>

                    <LanguageSwitcher />

                    <div>
                        <AuthToggle />
                    </div>
                </div>

                {/* Mobile Top Bar */}
                <div className="flex md:hidden items-center gap-3 justify-end">
                    <Link href="/Cart" >
                        <button className="relative text-blue-500 p-3 rounded-full border hover:cursor-pointer border-blue-500/20 bg-blue-500/20 duration-500 hover:bg-blue-500/10">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-2 -right-1 bg-blue-500 text-white rounded-full text-[14px] w-6 h-6 flex items-center justify-center">
                                {totalItems > 0 ? <>{totalItems}</> : <>0</>}
                            </span>
                        </button>
                    </Link>

                    <Link href="/Cart" >
                        <button className="relative text-primary p-3 rounded-full border hover:cursor-pointer border-yellow-500/20 bg-yellow-500/20 duration-500 hover:bg-yellow-500/10">
                            <MessagesSquare size={20} />
                            <span className="absolute -top-2 -right-1 bg-yellow-500 text-white rounded-full text-[14px] w-6 h-6 flex items-center justify-center">
                                {/* {totalItems > 0 ? <>{totalItems}</> : <>0</>} */}0
                            </span>
                        </button>
                    </Link>

                    <LanguageSwitcher />

                    {/* Mobile Menu Button */}
                    <button
                        className="text-white hover:cursor-pointer"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </nav>

            {isMenuOpen && (
                <div className="md:hidden text-white bg-white/10 border-t border-white/20 backdrop-blur-md  p-4 flex flex-col gap-4">
                    <Link
                        href="/"
                        className={clsx(
                            "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs",
                            pathname === "/" ? "text-blue-500" : "hover:bg-accent hover:text-blue-500"
                        )}
                    >
                        <House className="mr-1 w-5 h-5" />
                        Home
                    </Link>

                    <Link
                        href="/market-cars"
                        className={clsx(
                            "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs",
                            pathname === "/MarketPlace" ? "text-yellow-500" : "hover:text-yellow-500"
                        )}
                    >
                        <Car className="mr-1 w-5 h-5" />
                        MarketCars
                    </Link>

                    <Link
                        href="/Service"
                        className={clsx(
                            "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs",
                            pathname === "/Service" ? "text-purple-500" : "hover:text-purple-500"
                        )}
                    >
                        <Handshake className="mr-1 w-5 h-5" />
                        Service
                    </Link>
                    <div className="h-px w-full bg-zinc-100 hidden sm:block"></div>

                    <Link
                        href="/your-orders"
                        className={clsx(
                            "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  h-8 rounded-md px-3 text-xs relative",
                            pathname === "/UserOrdres" ? "text-yellow-500" : "hover:text-yellow-500"
                        )}
                    >
                        <span className="absolute -top-1 right-1/4 bg-yellow-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                            {orderCount ? orderCount : 0}
                        </span>
                        <ShoppingCart className="mr-1 w-5 h-5" />
                        Your Orders
                    </Link>

                    <div className="flex flex-col gap-2 pt-4 border-t border-primary/20">
                        {user ?
                            <div className="flex flex-col gap-2 w-full">
                                <div className="flex gap-4">
                                    <Link href={"/settings"} className="w-1/2">
                                        <Button variant="outline" className="w-full hover:cursor-pointer text-black">Settings</Button>
                                    </Link>

                                    <Button variant="destructive" className="w-1/2 over:cursor-pointer" onClick={() => signOut()}>Logout</Button>
                                </div>

                                {user.role === "ADMIN" &&
                                    <Link href={"/dashboard"} className="m-1/2">
                                        <Button className="w-full bg-yellow-700 hover:bg-yellow-700/70 duration-500 hover:cursor-pointer text-white">Dashboard</Button>
                                    </Link>
                                }
                            </div>
                            :
                            <div className="flex gap-2 w-full">
                                <Link href="/auth/login" className="w-1/2">
                                    <Button
                                        variant="outline"
                                        className="w-full hover:cursor-pointer border-primary text-primary hover:text-primary bg-black/10 hover:bg-black/20 duration-500"
                                        onClick={playSound}
                                    >
                                        Login
                                    </Button>
                                </Link>

                                <Link href="/auth/register" className="w-1/2">
                                    <Button
                                        className="w-full hover:cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground duration-500"
                                        onClick={playSound}
                                    >
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            )}
        </header>
    )
}
