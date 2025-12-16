"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User } from "lucide-react";
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
            <Button
                size="lg"
                onClick={() => setOpen(!open)}
                className="hover:cursor-pointer"
            >
                <User />
            </Button>

            {/* Dropdown Buttons */}
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute w-[90vw] max-w-[320px] sm:w-[280px] top-16 
                    right-2 flex flex-col gap-3 bg-gray-800 border-gray-700 p-4 
                    rounded-xl shadow-lg border z-50"
                >
                    {user ? (
                        <div className="">
                            <div className="flex items-start gap-2 mb-4">
                                <Image src={user.image || "/logo_user.png"} alt="image user"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                                <h1 className="font-bold text-white">My Account :
                                    <span className="text-sm block break-all">
                                        {user.email}
                                    </span>
                                </h1>
                            </div>

                            <div className="h-px w-full bg-zinc-600 rounded-full mb-4 hidden sm:block"></div>

                            <div>
                                <div className="flex items-center justify-center mb-4 gap-4">
                                    <Link href={"/settings"}>
                                        <Button variant="outline" className="hover:cursor-pointer">Settings</Button>
                                    </Link>
                                    <Button variant="destructive" className="hover:cursor-pointer" onClick={() => signOut()}>Logout</Button>
                                </div>

                                <div className="flex justify-center">
                                    {user.role === "ADMIN" && (
                                        <Link href={"/dashboard"}>
                                            <Button className="bg-yellow-700 hover:cursor-pointer text-white">Dashboard</Button>
                                        </Link>
                                    )}
                                </div>
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
