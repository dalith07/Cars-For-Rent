/* eslint-disable @typescript-eslint/no-unused-vars */
// import { UserWithProfile } from "@/lib/utils";

// interface Props {
//     user: UserWithProfile
// }

// const ProfileUser = ({ user }: Props) => {

//     return (
//         <div>
//             <h1>{user.email}</h1>
//         </div>
//     )
// }

// export default ProfileUser


"use client";

import { UserWithProfile } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Input } from "@/components/ui/input";
import Header from "@/components/dashboard/header";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
    user: UserWithProfile;
}

const ProfileUser = ({ user }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // USER
    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [selectedRols, setSelectedRols] = useState<string>(user.role);
    const [imageUrl, setImageUrl] = useState<string | null>(user.image);

    // USER PROFILE
    const [phone, setPhone] = useState<string>(user.Profile?.phoneNumber || "");
    const [streetAddress, setStreetAddress] = useState<string>(user.Profile?.streetAddress || "");
    const [postalCode, setPostalCode] = useState<string>(user.Profile?.postalCode || "");
    const [city, setCity] = useState<string>(user.Profile?.city || "");

    // HEDAER
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [activePage, setActivePage] = useState("dashboard")
    const [showNotifications, setShowNotifications] = useState(false)

    useEffect(() => {
        if (!containerRef.current) return;

        // Use GSAP timeline to avoid multiple mounts issues
        const tl = gsap.timeline({ defaults: { opacity: 0, y: 50, ease: "power3.out" } });

        // Animate children safely
        const children = containerRef.current.children;
        for (let i = 0; i < children.length; i++) {
            tl.to(children[i], { opacity: 1, y: 0, duration: 0.6 }, i * 0.2);
        }

        // Cleanup function to prevent duplicate animations on re-mount
        return () => {
            tl.kill();
        };
    }, []);

    return (
        <>
            {/* Header */}
            < div className="sticky top-0 z-20 bg-background shadow" >
                <Header
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    onNotificationsClick={() => setShowNotifications(!showNotifications)}
                    showNotifications={showNotifications}
                />
            </ div>


            <motion.div
                ref={containerRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mt-10 p-6 bg-gray-200/20 rounded-xl
                 shadow-md 6"
            >

                {/* User ID */}
                <motion.h1 className="text-2xl font-bold text-center">ID: {user.id}</motion.h1>

                <div className="flex items-center space-x-4 mt-7">
                    {/* Profile Image */}
                    <div className="flex flex-col gap-4">
                        <motion.div >
                            <Image
                                src={imageUrl || ""}
                                alt="Profile Image"
                                width={100}
                                height={100}
                                className="rounded-full mx-auto object-cover"
                            />
                        </motion.div>

                        <Button variant="outline" className="hover:cursor-pointer">Upload</Button>
                    </div>

                    {/* DATA USER */}
                    <div className="">
                        {/* Input to print user email */}
                        <div className="flex items-center flex-col gap-4">
                            {/* NAME */}
                            <div>
                                <Label className="text-gray-500 text-xs">Name*</Label>
                                <Input type="text" value={name} />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <Label className="text-gray-500 text-xs">Email*</Label>
                                <Input type="text" value={email} />
                            </div>

                            {/* ROLS */}
                            <div>
                                <label className="text-gray-500 text-xs">Rols*</label>
                                <Select value={selectedRols} onValueChange={(value) => setSelectedRols(value)}>
                                    <SelectTrigger className="w-[210px] hover:cursor-pointer">
                                        <SelectValue placeholder={selectedRols} />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem
                                                value="ADMIN"
                                                className="cursor-pointer data-highlighted:bg-yellow-500/20">
                                                Admin
                                            </SelectItem>

                                            <SelectItem
                                                value="MANAGER"
                                                className="cursor-pointer data-highlighted:bg-green-500/20">
                                                Manager
                                            </SelectItem>

                                            <SelectItem
                                                value="USER"
                                                className="cursor-pointer data-highlighted:bg-gray-500-500/20">
                                                User
                                            </SelectItem>
                                        </SelectGroup >
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* PHONE NUMBER */}
                            <div>
                                <Label className="text-gray-500 text-xs">Phone*</Label>
                                <Input type="text" value={phone} />
                            </div>


                            {/* STRESS ADRESS */}
                            <div>
                                <Label className="text-gray-500 text-xs">Street address*</Label>
                                <Input
                                    type="text"
                                    value={streetAddress}
                                />
                            </div>

                            {/* POSTAL CODE */}
                            <div>
                                <Label className="text-gray-500 text-xs">Postal code*</Label>
                                <Input
                                    type="text"
                                    value={postalCode}
                                />
                            </div>

                            {/* CITY */}
                            <div>
                                <Label className="text-gray-500 text-xs">City*</Label>
                                <Input
                                    type="text"
                                    value={city}
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </motion.div>
        </>
    );
};

export default ProfileUser;
