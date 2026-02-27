/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Car, Handshake, House, Menu, MessagesSquare, ShoppingCart, X } from "lucide-react"
import Link from "next/link"
import clsx from "clsx";
import { usePathname } from "next/navigation"
import gsap from "gsap";
import AuthToggle from "./auth-toggle"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useCart } from "@/lib/cart_context"
import { getOrderCount } from "@/actions/cart"
// import LanguageSwitcher from "./LanguageSwitcher"
import NotificationsCard from "./notifications-card"
import { getUserNotificationsCount } from "@/actions/dashboard/notifications"
import { Dialog, DialogContent, } from "./ui/dialog"
import UserChatPage from "./chats"
import ThemeButton from "./dark-light-button"
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/app/language-provider";
import { Button } from "./ui/button";
import { Language } from "@/app/i18n";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareUpwork } from "react-icons/fa6";
import { useCloseOnInteraction } from "@/hooks/useCloseOnInteraction";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [openNotifications, setOpenNotifications] = useState(false);
    const [openChat, setOpenChat] = useState(false)
    const [currentTextIndex, setCurrentTextIndex] = useState(0)
    const [notificationsCount, setNotificationsCount] = useState<number>(0);

    const { t, dir } = useLanguage();

    const user = useCurrentUser();

    const { language, setLanguage } = useLanguage();

    const langs: { code: Language; label: string }[] = [
        { code: "en", label: "English" },
        { code: "fr", label: "Français" },
        { code: "ar", label: "العربية" },
    ];

    const menuRef = useRef<HTMLDivElement>(null);

    useCloseOnInteraction({
        isOpen: isMenuOpen,
        onClose: () => setIsMenuOpen(false),
        elementRef: menuRef,
    });

    useEffect(() => {
        if (!user?.id) return;

        const fetchCount = async () => {
            const count = await getUserNotificationsCount();
            setNotificationsCount(count);
        };

        fetchCount();
    }, [user?.id]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    const [orderCount, setOrderCount] = useState(0);

    const pathname = usePathname();
    const titleRef = useRef<HTMLSpanElement>(null);

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

    return (
        <header
            className={clsx(
                "fixed w-full z-40 pb-safe transition-all duration-300 border-b backdrop-blur-md",
                isScrolled
                    ? "bg-white/5 dark:bg-black/70 border-black/5 dark:border-white/10"
                    : "bg-white dark:bg-black/30 border-black/5 dark:border-white/10"
            )}
            dir={dir}
        >
            <nav className="container mx-auto sm:px-2 px-4 py-3 flex items-center justify-between">
                {/* Logo or Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        className="text-foreground dark:text-white hover:cursor-pointer"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>

                <div className="hidden md:block">
                    <Link href={"/"} className="text-foreground dark:text-white text-sm md:text-[1rem] font-bold">
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
                                "inline-flex text-sm items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3",
                                pathname === "/" ? "text-blue-500" : "hover:text-blue-500 text-foreground dark:text-white"
                            )}
                        >
                            <House className="mr-1" size={20} />
                            {t("navbarHome")}
                        </Link>

                        <Link
                            href="/market-cars"
                            className={clsx(
                                "inline-flex text-sm text-foreground dark:text-white items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 ",
                                pathname === "/MarketCars" ? "text-blue-500" : "hover:text-blue-500 text-foreground dark:text-white"
                            )}
                        >
                            <Car className="mr-1" size={20} />
                            {t("navbarMarketCars")}
                        </Link>

                        <Link
                            href="/Service"
                            className={clsx(
                                "inline-flex text-sm text-foreground dark:text-white items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3",
                                pathname === "/Service" ? "text-blue-500" : "hover:text-blue-500 text-foreground dark:text-white"
                            )}
                        >
                            <Handshake className="mr-1" size={20} />
                            {t("navbarService")}
                        </Link>
                        <div className="h-8 w-px bg-border dark:bg-zinc-200 hidden sm:block"></div>

                        <Link
                            href="/your-orders"
                            className={clsx(
                                "inline-flex text-sm text-foreground dark:text-white items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  h-8 rounded-md px-3 relative",
                                pathname === "/UserOrdres" ? "text-blue-500" : "hover:text-blue-500 text-foreground dark:text-white"
                            )}
                        >
                            <span className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                {orderCount ? orderCount : 0}
                            </span>
                            <ShoppingCart className="mr-1" size={20} />
                            {t("navbarYourOrders")}
                        </Link>

                        {/* Ai Chat */}
                        {/* <Link
                            href="/Ai-cars"
                            className="relative inline-block"
                        >
                            <div className="absolute inset-0 rounded-lg bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x blur-lg opacity-70 transition-all duration-1000 group-hover:opacity-100"></div>

                            <div className="absolute -inset-1 rounded-lg bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50 blur-2xl animate-pulse"></div>

                            <Button
                                className="relative group flex items-center gap-2 px-6 py-3 rounded-lg bg-black hover:bg-transparent bg-opacity-30 text-white font-bold uppercase tracking-wider shadow-lg transition-transform duration-500
               border border-white border-opacity-20 backdrop-blur-sm"
                            >
                                <svg
                                    className="w-5 h-5 animate-bounce text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6" />
                                </svg>
                                Ask AI
                            </Button>
                        </Link> */}

                        <Link href="/Ai-cars" className="relative inline-block group">
                            {/* Animated Border */}
                            <div className="absolute -inset-1 rounded-lg bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 blur-lg opacity-60 transition-all duration-500
                  group-hover:opacity-100 animate-gradient-x "/>

                            {/* Button */}
                            <Button
                                className="relative flex items-center gap-2 px-6 py-3 rounded-lg bg-black hover:bg-transparent bg-opacity-30 text-white font-bold uppercase tracking-wider shadow-lg
                hover:border-white hover:border-opacity-20 transition-all duration-500
              z-10 border border-white border-opacity-20 backdrop-blur-sm"
                            >
                                <svg
                                    className="w-8 h-8 animate-bounce text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6" />
                                </svg>
                                Ask AI
                            </Button>
                        </Link>

                    </div>
                </div>

                {/* BUTTONS RIGHT */}
                <div className="hidden md:flex items-center gap-4">
                    {/* BUTTON CART  */}
                    <Link href="/Cart" >
                        <button className="flex items-center justify-center relative text-blue-500 w-11 h-11 rounded-full border hover:cursor-pointer border-blue-500/20 bg-blue-500/20 duration-500 hover:bg-blue-500/10">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-2 -right-1 bg-blue-500 text-white rounded-full text-[13px] w-5 h-5 flex items-center justify-center">
                                {totalItems > 0 ? <>{totalItems}</> : <>0</>}
                            </span>
                        </button>
                    </Link>

                    {/* BUTTON NOTIFICATION*/}
                    {user?.role === "USER" &&
                        <div className="relative">
                            <button
                                onClick={() => setOpenNotifications((prev) => !prev)}
                                className="flex items-center justify-center relative hover:cursor-pointer text-primary w-11 h-11 rounded-full border border-yellow-500/20 bg-yellow-500/20 duration-500 hover:bg-yellow-500/10"
                            >
                                <Bell size={22} />
                            </button>

                            <span className="absolute -top-2 -right-1 bg-primary text-white rounded-full text-[14px] w-6 h-6 flex items-center justify-center">
                                {notificationsCount}
                            </span>

                            {openNotifications && <NotificationsCard />}
                        </div>
                    }

                    {/* BUTTON CHAT COMPANYUSER WITH ADMIN */}
                    {user?.role === "COMPANY_OWNER" &&
                        <button
                            onClick={() => setOpenChat(true)}
                            className="flex items-center justify-center relative text-primary w-11 h-11 rounded-full border hover:cursor-pointer border-yellow-500/20 bg-yellow-500/20 duration-500 hover:bg-yellow-500/10">
                            <MessagesSquare size={22} />
                            <span className="absolute -top-2 -right-1 bg-yellow-500 text-white rounded-full text-[13px] w-5 h-5 flex items-center justify-center">
                                {/* {totalItems > 0 ? <>{totalItems}</> : <>0</>} */}0
                            </span>
                        </button>
                    }

                    {/* ===== CHAT DIALOG ===== */}
                    <Dialog open={openChat} onOpenChange={setOpenChat}>
                        <DialogContent
                            className="max-w-6xl h-[90vh] p-0 flex flex-col border border-white/20 rounded-lg"
                        >
                            {/* <DialogHeader className="px-4 py-3 border-b">
                                <DialogTitle>Chat with Admin</DialogTitle>
                            </DialogHeader> */}

                            <UserChatPage />
                        </DialogContent>
                    </Dialog>

                    {/* BUTTON LANGUAGE SWITCH */}
                    <LanguageSwitcher />

                    {/* BUTTON LIGHT & DAR MODE  */}
                    <ThemeButton />

                    {/* BUTTON USER  */}
                    <AuthToggle />
                </div>

                {/* Mobile Top Bar */}
                <div className="flex md:hidden items-center gap-3 justify-end">
                    <Link href="/Cart" >
                        <button className="relative text-blue-500 p-3 rounded-full border hover:cursor-pointer border-blue-500/20 bg-blue-500/20 duration-500 hover:bg-blue-500/10">
                            <ShoppingCart size={18} />
                            <span className="absolute -top-2 -right-1 bg-blue-500 text-white rounded-full text-[14px] w-6 h-6 flex items-center justify-center">
                                {totalItems > 0 ? <>{totalItems}</> : <>0</>}
                            </span>
                        </button>
                    </Link>

                    {user?.role === "USER" &&
                        <div className="relative">
                            <button
                                onClick={() => setOpenNotifications((prev) => !prev)}
                                className="relative hover:cursor-pointer text-primary p-3 rounded-full border border-yellow-500/20 bg-yellow-500/20 duration-500 hover:bg-yellow-500/10"
                            >
                                <Bell size={18} />
                            </button>

                            <span className="absolute -top-2 -right-1 bg-primary text-white rounded-full text-[14px] w-6 h-6 flex items-center justify-center">
                                {notificationsCount}
                            </span>

                            {openNotifications && <NotificationsCard />}
                        </div>
                    }

                    {user?.role === "COMPANY_OWNER" &&
                        <Link href="/chat" >
                            <button
                                onClick={() => setOpenChat(true)}
                                className="relative text-primary p-3 rounded-full border hover:cursor-pointer border-yellow-500/20 bg-yellow-500/20 duration-500 hover:bg-yellow-500/10">
                                <MessagesSquare size={18} />
                                <span className="absolute -top-2 -right-1 bg-yellow-500 text-white rounded-full text-[14px] w-6 h-6 flex items-center justify-center">
                                    0
                                </span>
                            </button>
                        </Link>
                    }

                    {/* <LanguageSwitcher /> */}

                    <ThemeButton />

                    <AuthToggle />
                </div>
            </nav>

            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="md:hidden text-foreground dark:text-accent-foreground
                border-t backdrop-blur-md p-4 flex flex-col gap-4 dark:bg-black/10
                border-black/5 dark:border-white/10 z-999">
                    <Link
                        href="/"
                        className={clsx(
                            "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs",
                            pathname === "/" ? "text-blue-500" : "hover:bg-accent hover:text-blue-500"
                        )}
                    >
                        <House className="m-1 w-5 h-5" />
                        {t("navbarHome")}
                    </Link>

                    <Link
                        href="/market-cars"
                        className={clsx(
                            "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs",
                            pathname === "/MarketPlace" ? "text-yellow-500" : "hover:text-yellow-500"
                        )}
                    >
                        <Car className="m-1 w-5 h-5" />
                        {t("navbarMarketCars")}
                    </Link>

                    <Link
                        href="/Service"
                        className={clsx(
                            "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs",
                            pathname === "/Service" ? "text-purple-500" : "hover:text-purple-500"
                        )}
                    >
                        <Handshake className="m-1 w-5 h-5" />
                        {t("navbarService")}
                    </Link>

                    <div className="h-px w-full dark:bg-slate-200/20 bg-gray-200" />

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
                        <ShoppingCart className="m-1 w-5 h-5" />
                        {t("navbarYourOrders")}
                    </Link>

                    <Link href="/Ai-cars" className="relative inline-flex items-center justify-center group">
                        {/* Animated Border */}
                        <div
                            className="
  absolute inset-y-0 left-1/2 -translate-x-1/2
  w-1/4 md:w-3/4
  rounded-lg
  bg-linear-to-r from-blue-400 via-purple-400 to-pink-400
  blur-md md:blur-lg
  opacity-60 group-hover:opacity-100
  transition duration-500
  "
                        />

                        {/* Button */}
                        <Button
                            className="relative flex items-center gap-2 px-6 py-3 rounded-lg bg-black hover:bg-transparent bg-opacity-30 text-white font-bold uppercase tracking-wider shadow-lg
                hover:border-white hover:border-opacity-20 transition-all duration-500
              z-10 border border-white border-opacity-20 backdrop-blur-sm"
                        >
                            <svg
                                className="w-8 h-8 animate-bounce text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6" />
                            </svg>
                            Ask AI
                        </Button>
                    </Link>

                    <div className="flex sm:flex-row flex-col sm:justify-center items-center gap-3">
                        <div className="text-sm font-medium text-accent-foreground">
                            Language :
                        </div>

                        <div className="flex items-center bg-slate-800/60 border border-white/10 rounded-xl p-1">
                            {langs.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code)}
                                    className={clsx(
                                        "px-4 py-2 text-sm rounded-lg transition-all duration-300",
                                        language === lang.code
                                            ? "bg-slate-700 text-white shadow"
                                            : "text-slate-400 hover:text-white"
                                    )}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* <div className="flex sm:flex-row flex-col sm:justify-center items-center gap-3"> */}
                    <div className="flex items-center justify-center gap-3 m-3">
                        <div className="text-sm font-medium">Social Media:</div>
                        <div className="flex gap-4">
                            <Link
                                href="https://www.linkedin.com/in/mohamed-ali-theiri-274540311"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <FaLinkedin size={24} />
                            </Link>
                            <Link
                                href="https://www.upwork.com/freelancers/~01e8d2f1bf7276b7cd?mp_source=share"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800"
                            >
                                <FaSquareUpwork size={24} />
                            </Link>
                        </div>
                    </div>
                </div>
            )
            }
        </header >
    )
}
