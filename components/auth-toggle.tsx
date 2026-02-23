"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Building2, ChartColumnStacked, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useCloseOnInteraction } from "@/hooks/useCloseOnInteraction";
import { useLanguage } from "@/app/language-provider";

export default function AuthToggle() {
    const [open, setOpen] = useState(false);
    const user = useCurrentUser();
    const { t, dir } = useLanguage();

    // Reference to detect click outside
    const ref = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null);

    const playSound = () => {
        const audio = new Audio("/sounds/sound_mouse.mp3");
        audio.volume = 0.5;
        // audio.playbackRate = 1.3;  SPEED SOUND
        audio.play().catch((err) => console.log("Audio error:", err));
    };

    // Close the card when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Global close logic
    useCloseOnInteraction({
        isOpen: open,
        onClose: () => setOpen(false),
        elementRef: ref,
        ignoreRefs: [buttonRef],
    })

    return (
        <div ref={ref} className="relative">

            <button
                ref={buttonRef}
                onClick={() => {
                    playSound();
                    setOpen(prev => !prev);
                }}
                className="inline-flex items-center justify-center
               w-11 h-11 rounded-full
               bg-white/10 text-gray-500
               hover:bg-blue-500/10 duration-500
               border border-gray-500/20 hover:cursor-pointer"
            >
                {user?.image ? (
                    <Image
                        src={user.image}
                        alt="image"
                        width={50}
                        height={50}
                        className="rounded-full w-full h-full"
                    />
                ) : (
                    <User size={22} />
                )}

                {user?.role === "ADMIN" && (
                    <span className="absolute top-0 right-0 text-yellow-500">
                        <FaStar size={15} className="animate-pulse" />
                    </span>
                )}
            </button>

            {/* Dropdown Buttons */}
            {open && (
                <motion.div
                    dir={dir}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`
    absolute z-50 mt-3
    ${dir === "rtl" ? "left-0" : "right-0"}
    min-w-[220px] w-max max-w-[90vw]
    rounded-xl border bg-background shadow-lg p-4
  `}
                >
                    {user ? (
                        <div>
                            <div className="flex flex-col gap-4 mb-4">
                                <div className="relative m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-primary bg-background">
                                    <Image
                                        src={user.image || "/logo_user.png"}
                                        alt="image user"
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                    />
                                </div>

                                <h1 className="text-accent-foreground font-medium">My Account:
                                    <span className="opacity-80 block font-normal break-all text-xs">
                                        {user.email}
                                    </span>
                                </h1>
                            </div>

                            <div className="h-px w-full bg-white/20 rounded-full mb-4 hidden sm:block"></div>

                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex flex-col items-center justify-center w-full gap-4">
                                    {user.role === "COMPANY_OWNER" ?
                                        <Link href={"/company"} className="w-full">
                                            <Button
                                                variant="outline"
                                                className="w-full hover:cursor-pointer text-fuchsia-500 bg-fuchsia-500/20 
                                            hover:bg-fuchsia-500/10 duration-500 hover:text-fuchsia-500 border-fuchsia-500/20">
                                                Affiliate Dashboard    <ChartColumnStacked />
                                            </Button>
                                        </Link>
                                        :
                                        <Link href={"/create-company-account"} className="w-full">
                                            <Button
                                                variant="outline"
                                                className="w-full text-xs hover:cursor-pointer text-primary bg-primary/20 
                                            hover:bg-primary/10 duration-500 hover:text-primary border-primary/20">
                                                Create Company Account  <Building2 />
                                            </Button>
                                        </Link>
                                    }

                                    <div className="h-px w-full bg-white/20 rounded-full mb-2 hidden sm:block"></div>

                                    <div className="flex w-full gap-4">
                                        <Link href={"/settings"} className="w-1/2">
                                            <Button variant="outline" className="w-full hover:cursor-pointer text-accent-foreground">Settings</Button>
                                        </Link>
                                        <Button variant="destructive" className="w-1/2 over:cursor-pointer" onClick={() => signOut()}>Logout</Button>
                                    </div>
                                </div>


                                {user.role === "ADMIN" && <>
                                    <div className="h-px w-full bg-white/20 rounded-full mb-2 hidden sm:block"></div>

                                    <Link href={"/dashboard"} className="m-1/2">
                                        <Button className="w-full bg-yellow-700 hover:bg-yellow-700/70 duration-500 hover:cursor-pointer text-white">Dashboard</Button>
                                    </Link>
                                </>
                                }
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="mb-4 text-sm font-semibold text-accent-foreground">{t("authToggleTitleCreateCompte")}</h1>
                            <div className="h-px w-full bg-zinc-400/20 dark:bg-slate-100/20 rounded-full mb-4 hidden sm:block"></div>
                            <div className="flex items-center justify-center gap-4">
                                <Link href={"/auth/login"}>
                                    <Button
                                        className="w-full font-bold hover:cursor-pointer"
                                    >
                                        {t("authToggleButtonLogin")}
                                    </Button>
                                </Link>

                                <Link href={"/auth/register"}>
                                    <Button variant="outline" className="w-full font-bold hover:cursor-pointer"> {t("authToggleButtonRegister")}</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
