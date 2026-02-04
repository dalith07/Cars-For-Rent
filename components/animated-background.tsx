"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function FloatingOrangeGlow() {
    const orbRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const orb = orbRef.current;
        if (!orb) return;

        // ===== FLOATING ANIMATION =====
        gsap.to(orb, {
            x: "+=30", // move right
            y: "+=20", // move down
            scale: 1.4,
            duration: 3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        });

        gsap.to(orb, {
            x: "-=30", // move left
            y: "-=20", // move up
            scale: 1.2,
            duration: 4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: 1,
        });
    }, []);

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center -z-10">
            <div
                ref={orbRef}
                className="w-32 h-32 rounded-full bg-orange-500 opacity-60 blur-3xl shadow-[0_0_80px_rgb(255,140,0)]"
            />
        </div>
    );
}
