/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "./ui/button";
import { useLanguage } from "@/app/language-provider";

const Hero = () => {
    const imageCars = [
        "/cars/mercedes_a_class.png",
        "/cars/golf_7.png",
        "/cars/tesla.png",
        "/cars/toyota_corolla-2.png",
        "/cars/bmw-x6-1.png",
        "/cars/Bentley-Bentayga-1.png",
        "/cars/bmw_330i_m_sport_f30_1.png",
        "/cars/bmw_m5_e60_1.png",
        "/cars/bmw_m3_competition_1.png",
    ];

    const { t } = useLanguage();

    const [bgImage, setBgImage] = useState(imageCars[0]);
    const [carIndex, setCarIndex] = useState(0);

    const bgRef = useRef<HTMLDivElement | null>(null);
    const smallCarRef = useRef<HTMLDivElement | null>(null);

    // Auto change bottom car every 5 seconds with smooth animation
    useEffect(() => {
        const interval = setInterval(() => {
            if (!smallCarRef.current) return;

            // Fade-out current small car
            gsap.to(smallCarRef.current, {
                opacity: 0,
                x: -40,
                scale: 0.95,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    // Change image
                    setCarIndex((prev) => (prev + 1) % imageCars.length);

                    // Fade-in new car
                    gsap.fromTo(
                        smallCarRef.current,
                        { opacity: 0, x: 80, scale: 0.9 },
                        {
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            duration: 0.9,
                            ease: "power3.out",
                        }
                    );
                },
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Floating animation for small car (continuous)
    useEffect(() => {
        if (!smallCarRef.current) return;

        gsap.to(smallCarRef.current, {
            y: -6,
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: "sine.inOut",
        });
    }, []);

    // Handle small car click → change background smoothly
    const handleImageClick = () => {
        if (!bgRef.current) return;

        gsap.to(bgRef.current, {
            opacity: 0,
            scale: 1.05,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                setBgImage(imageCars[carIndex]);

                gsap.fromTo(
                    bgRef.current,
                    { opacity: 0, scale: 0.95 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 1.2,
                        ease: "power1.out",
                    }
                );
            },
        });
    };

    return (
        <section className="relative bg-background/80 dark:bg-black/10 backdrop-blur-md w-full h-screen flex items-center justify-center overflow-hidden">

            {/* Background Image + overlay */}
            {/* <div ref={bgRef} className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src={bgImage}
                    alt="Hero Car"
                    fill
                    priority
                    className="object-cover object-[center_60%] scale-[0.85] md:scale-[0.9]"
                />
                <div className="absolute inset-0 bg-black/30" />
            </div> */}

            {/* Background wrapper */}
            <div className="absolute inset-0 z-0 overflow-hidden">

                {/* Animated image ONLY */}
                <div ref={bgRef} className="absolute inset-0">
                    <Image
                        src={bgImage}
                        alt="Hero Car"
                        fill
                        priority
                        quality={100}
                        sizes="100vw"
                        className="object-contain  object-center md:object-[center_60%]"
                    />
                </div>

                {/* FIXED overlay (no animation) */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] md:backdrop-blur-xs pointer-events-none" />
            </div>

            {/* Main Content */}
            <div className="relative z-20 max-w-6xl text-center px-6 text-white">
                <h1 className="text-4xl md:text-6xl font-bold 
                mb-4 text-zinc-300 dark:text-white">
                    {t("heroTitle")}
                    <span className="text-yellow-500">{t("heroTitleHighlighted")}</span>
                </h1>

                <p className="text-gray-200 opacity-80 text-md md:text-xl mb-8">
                    {t("heroSubtitle")}
                </p>

                <div className="flex gap-4 justify-center">
                    <Link href="#">
                        <Button size="lg" variant="secondary" className="hover:cursor-pointer">
                            {t("heroExploreCars")}
                        </Button>
                    </Link>

                    <Link href="/market-cars">
                        <Button size="lg" className="hover:cursor-pointer">
                            {t("heroRentCar")}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Bottom Animated Small Car */}
            <div
                ref={smallCarRef}
                onClick={handleImageClick}
                className="absolute bottom-0 right-0 w-64 md:w-96 z-20 cursor-pointer"
            >
                <Image
                    src={imageCars[carIndex]}
                    alt="Small Car"
                    width={384}
                    height={192}
                    className="object-contain"
                />
            </div>

            {/* Bottom Blur */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/30 to-transparent z-20" />

        </section>
    );
};

export default Hero;
