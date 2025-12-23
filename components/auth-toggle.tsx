"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Building2, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

export default function AuthToggle() {
    const [open, setOpen] = useState(false);
    const user = useCurrentUser();

    const playSound = () => {
        const audio = new Audio("/sounds/sound_car.mp3");
        audio.volume = 0.5;
        audio.play().catch((err) => console.log("Audio error:", err));
    };

    return (
        <div className="relative">
            {/* Main Button */}
            {/* <Button
                size="lg"
                onClick={() => setOpen(!open)}
                className="hover:cursor-pointer"
            >
                <User />
            </Button> */}

            {/* CART */}
            <button
                onClick={() => setOpen(!open)}
                className="inline-flex items-center justify-center
                            w-14 h-14 rounded-full
                            bg-white/10 text-gray-500
                            hover:bg-blue-500/10 duration-500
                            border border-gray-500/20 hover:cursor-pointer"
            >
                {user?.image ?
                    <Image src={user.image} alt="image" width={50} height={50}
                        className="rounded-full w-full h-full"
                    />
                    :
                    <User size={24} />}

                {user?.role === "ADMIN" && <span
                    className="absolute top-0 right-0 text-yellow-500"
                >
                    <FaStar size={15} className="animate-pulse" />
                </span>}
            </button>

            {/* Dropdown Buttons */}
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute z-50 w-[90vw] max-w-[320px] sm:w-[280px] top-18 right-2 flex flex-col gap-3 bg-black/70 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl"
                >
                    {user ? (
                        <div className="">
                            <div className="flex flex-col gap-4 mb-4">
                                <Image src={user.image || "/logo_user.png"} alt="image user"
                                    width={50}
                                    height={50}
                                    className="rounded-full m-auto"
                                />

                                <h1 className="text-white">My Account
                                    <span className="text-slate-200 opacity-80 block break-all">
                                        {user.email}
                                    </span>
                                </h1>
                            </div>

                            <div className="h-px w-full bg-white/20 rounded-full mb-4 hidden sm:block"></div>

                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex flex-col items-center justify-center w-full gap-4">
                                    <Link href={"/create-company-account"} className="w-full">
                                        <Button
                                            variant="outline"
                                            className="w-full hover:cursor-pointer text-primary bg-transparent 
                                            hover:bg-primary/20 duration-500 hover:text-primary border-primary/20">
                                            Create Company Account  <Building2 />
                                        </Button>
                                    </Link>

                                    <div className="h-px w-full bg-white/20 rounded-full mb-2 hidden sm:block"></div>

                                    <div className="flex w-full gap-4">
                                        <Link href={"/settings"} className="w-1/2">
                                            <Button variant="outline" className="w-full hover:cursor-pointer text-black">Settings</Button>
                                        </Link>
                                        <Button variant="destructive" className="w-1/2 over:cursor-pointer" onClick={() => signOut()}>Logout</Button>
                                    </div>
                                </div>
                                <div className="h-px w-full bg-white/20 rounded-full mb-2 hidden sm:block"></div>

                                {user.role === "ADMIN" &&
                                    <Link href={"/dashboard"} className="m-1/2">
                                        <Button className="w-full bg-yellow-700 hover:bg-yellow-700/70 duration-500 hover:cursor-pointer text-white">Dashboard</Button>
                                    </Link>
                                }
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="mb-4 font-medium text-white">Create Compte :</h1>

                            <div className="h-px w-full bg-zinc-600 rounded-full mb-4 hidden sm:block"></div>

                            <div className="flex gap-4">
                                <Link href={"/auth/login"} >
                                    <Button size="lg"
                                        className="w-full font-bold hover:cursor-pointer"
                                        onClick={playSound}
                                    >
                                        Login
                                    </Button>
                                </Link>

                                <Link href={"/auth/register"}>
                                    <Button variant="outline" size="lg" className="w-full font-bold hover:cursor-pointer">Register</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
