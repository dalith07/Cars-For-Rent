"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedBackground() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // CREATE 3 floating neon blobs
        const blob1 = document.createElement("div");
        const blob2 = document.createElement("div");
        const blob3 = document.createElement("div");

        blob1.className = "neon-blob blob1";
        blob2.className = "neon-blob blob2";
        blob3.className = "neon-blob blob3";

        container.appendChild(blob1);
        container.appendChild(blob2);
        container.appendChild(blob3);

        // GSAP FLOAT ANIMATION
        gsap.to(".blob1", {
            x: 200,
            y: 100,
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        gsap.to(".blob2", {
            x: -150,
            y: -120,
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        gsap.to(".blob3", {
            x: 120,
            y: -180,
            duration: 12,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // ADD 20 NEON SPEED LINES
        const lines = Array.from({ length: 20 }).map(() => {
            const el = document.createElement("div");
            el.className = "neon-speed-line";
            container.appendChild(el);
            return el;
        });

        // Animate lines
        lines.forEach((line) => {
            gsap.set(line, {
                x: gsap.utils.random(0, window.innerWidth),
                y: gsap.utils.random(-100, window.innerHeight),
                scaleY: gsap.utils.random(5, 30),
                opacity: gsap.utils.random(0.2, 0.8),
            });

            gsap.to(line, {
                y: "+=400",
                duration: gsap.utils.random(1, 3),
                ease: "power1.out",
                repeat: -1,
            });
        });

        // ✅ REMOVE MOUSE FOLLOW — background stays static
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-10 overflow-hidden bg-[#05050a]"
        />
    );
}

// "use client";

// import { useEffect, useRef } from "react";
// import gsap from "gsap";

// export default function AnimatedBackground() {
//     const containerRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         const container = containerRef.current;
//         if (!container) return;

//         // CREATE 50 STARS
//         Array.from({ length: 50 }).forEach(() => {
//             const el = document.createElement("div");
//             el.className = "star";
//             container.appendChild(el);

//             // INITIAL POSITION
//             gsap.set(el, {
//                 x: gsap.utils.random(0, window.innerWidth),
//                 y: gsap.utils.random(-window.innerHeight, 0),
//                 scale: gsap.utils.random(0.5, 1.5),
//                 opacity: gsap.utils.random(0.3, 1),
//             });

//             // FALLING ANIMATION
//             gsap.to(el, {
//                 y: window.innerHeight + 50, // move past bottom
//                 duration: gsap.utils.random(5, 15), // random speed
//                 repeat: -1, // loop infinitely
//                 ease: "linear",
//                 delay: gsap.utils.random(0, 5), // stagger start
//             });
//         });
//     }, []);

//     return (
//         <div
//             ref={containerRef}
//             className="fixed inset-0 -z-10 overflow-hidden bg-[#05050a]"
//         />
//     );
// }



// "use client";

// import { useEffect, useRef } from "react";
// import gsap from "gsap";

// export default function AnimatedBackground() {
//     const containerRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         const container = containerRef.current;
//         if (!container) return;

//         const width = window.innerWidth;
//         const height = window.innerHeight;

//         // CREATE PARTICLES
//         Array.from({ length: 100 }).forEach(() => {
//             const particle = document.createElement("div");
//             particle.className = "particle";
//             container.appendChild(particle);

//             gsap.set(particle, {
//                 x: gsap.utils.random(0, width),
//                 y: gsap.utils.random(0, height),
//                 scale: gsap.utils.random(0.3, 1),
//                 opacity: gsap.utils.random(0.2, 0.8),
//             });

//             gsap.to(particle, {
//                 y: height + 50,
//                 duration: gsap.utils.random(4, 12),
//                 ease: "linear",
//                 repeat: -1,
//                 delay: gsap.utils.random(0, 5),
//             });

//             gsap.to(particle, {
//                 x: `+=${gsap.utils.random(-50, 50)}`,
//                 duration: gsap.utils.random(2, 6),
//                 ease: "sine.inOut",
//                 repeat: -1,
//                 yoyo: true,
//             });
//         });

//         // CREATE SPEED STREAKS
//         Array.from({ length: 30 }).forEach(() => {
//             const streak = document.createElement("div");
//             streak.className = "streak";
//             container.appendChild(streak);

//             gsap.set(streak, {
//                 x: gsap.utils.random(0, width),
//                 y: gsap.utils.random(-height, 0),
//                 scaleY: gsap.utils.random(10, 40),
//                 opacity: gsap.utils.random(0.2, 0.7),
//             });

//             gsap.to(streak, {
//                 y: height + 50,
//                 duration: gsap.utils.random(1, 3),
//                 ease: "power1.out",
//                 repeat: -1,
//             });
//         });
//     }, []);

//     return (
//         <div
//             ref={containerRef}
//             className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0f]"
//         />
//     );
// }
