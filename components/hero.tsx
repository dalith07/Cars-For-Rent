/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "./ui/button";

const Hero = () => {
    const imageCars = [
        "/cars/mercedes_a_class.png",
        "/cars/mercedes_a_class_2.png",
        "/cars/tesla.png",
        "/cars/bmw-x6-1.png",
    ];

    const [bgImage, setBgImage] = useState(imageCars[0]);
    const [carIndex, setCarIndex] = useState(0);

    // GSAP refs
    const bgRef = useRef(null);
    const smallCarRef = useRef(null);

    // Auto change bottom image every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCarIndex((prev) => (prev + 1) % imageCars.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Animate bottom image fade/slide
    useEffect(() => {
        if (smallCarRef.current) {
            gsap.fromTo(
                smallCarRef.current,
                { opacity: 0, x: 40 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
            );
        }
    }, [carIndex]);

    // Smooth GSAP transition for background image change
    const handleImageClick = () => {
        // fade out
        gsap.to(bgRef.current, {
            opacity: 0,
            scale: 1.05,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                setBgImage(imageCars[carIndex]); // change image

                // fade-in new background
                gsap.fromTo(
                    bgRef.current,
                    { opacity: 0, scale: 1.05 },
                    { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
                );
            },
        });
    };

    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">

            {/* Background Image */}
            <div ref={bgRef} className="absolute inset-0 z-0">
                <Image
                    src={bgImage}
                    alt="Hero Car"
                    fill
                    priority
                    className="object-contain sm:object-cover object-center"
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 z-10"></div>

            {/* Bottom Blur Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/10 to-transparent backdrop-blur-sm z-10"></div>

            {/* Main Content */}
            <div className="relative z-20 max-w-6xl text-center px-6 text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    Rent Your Dream Car <span className="text-yellow-500">Today</span>
                </h1>

                <p className="text-gray-300 opacity-80 text-md md:text-xl mb-8">
                    Find the perfect car for your journey. Fast, easy, and reliable.
                </p>

                <div className="flex gap-4 justify-center">
                    <Link href="#" >
                        <Button size={"lg"} variant="secondary" className="hover:cursor-pointer" >
                            Explore Cars
                        </Button>
                    </Link>

                    <Link href="/market-cars">
                        <Button size={"lg"} className="hover:cursor-pointer">
                            Rent a Car
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Bottom Animated Car */}
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
        </section>
    );
};

export default Hero;
