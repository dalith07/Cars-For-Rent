"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";


const CARS_ITEMS = [
    { src: "/cars/audi_q7.png", size: 80 },
    { src: "/cars/Bentley-Bentayga-1.png", size: 100 },
    { src: "/cars/bmw_330i_m_sport_f30_1.png", size: 90 },
    { src: "/cars/bmw_m5_competition_2.png", size: 85 },
    { src: "/cars/Mercedes-G-Class.png", size: 100 },
    { src: "/cars/tesla_model_y_3.png", size: 80 },
    { src: "/cars/toyota_corolla-2.png", size: 90 },
    { src: "/cars/golf_7.png", size: 90 },
    { src: "/cars/bmw-x6-1.png", size: 90 },
    { src: "/cars/golf_7_2.png", size: 90 },

];

export default function AnimatedBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            itemsRef.current.forEach((el, index) => {
                if (!el) return;

                const startX = gsap.utils.random(-100, window.innerWidth + 100);
                const startY = gsap.utils.random(window.innerHeight * 0.3, window.innerHeight);
                const driftX = gsap.utils.random(-120, 120);
                const floatY = gsap.utils.random(-300, -600);
                const duration = gsap.utils.random(10, 18);

                gsap.set(el, {
                    x: startX,
                    y: startY,
                    opacity: 0,
                    scale: gsap.utils.random(0.7, 1.1),
                    rotation: gsap.utils.random(-15, 15),
                });

                gsap.to(el, {
                    x: `+=${driftX}`,
                    y: floatY,
                    opacity: 1,
                    rotation: `+=${gsap.utils.random(30, 60)}`,
                    duration,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    delay: index * 0.4,
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);


    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-10 overflow-hidden
                bg-linear-to-br from-black via-zinc-900 to-black"
        >
            {/* Orange glow blur */}
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px]
                    bg-blue-500/20 rounded-full blur-[160px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px]
                    bg-blue-400/10 rounded-full blur-[140px]" />

            {CARS_ITEMS.map((item, i) => (
                <motion.div
                    key={i}
                    ref={(el) => {
                        if (el) itemsRef.current[i] = el;
                    }}
                    className="absolute top-24 pointer-events-none"
                    style={{ width: item.size, height: item.size }}
                >
                    <Image
                        src={item.src}
                        alt="Food"
                        width={item.size}
                        height={item.size}
                        className="w-full h-full object-contain
                        drop-shadow-[0_0_25px_rgba(255,140,0,0.35)]"
                    />
                </motion.div>
            ))}
        </div>
    );

}
