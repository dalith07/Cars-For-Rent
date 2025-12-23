// "use client";
// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import Image from "next/image";

// const images = [
//     "/logos/logo-audi.png",
//     "/logos/logo-bmw.png",
//     "/logos/logo-mercedes.png",
//     "/logos/logo-bugati.png",
//     "/logos/logo-porche.png",
//     "/logos/logo-tesla.png",
//     "/logos/logo-ford.png",
//     "/logos/logo-mini.png",
//     "/logos/logo-seat.png",
//     "/logos/logo-kia.png",
//     "/logos/logo-toyota.png",
//     "/logos/logo-chevrolet.png",
// ];

// export default function InfiniteLogoSlider() {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const rowRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const ctx = gsap.context(() => {
//             const row = rowRef.current;
//             if (!row) return;

//             const totalWidth = row.scrollWidth / 2;

//             // 🔁 Infinite seamless scroll
//             gsap.to(row, {
//                 x: -totalWidth,
//                 duration: 30,
//                 ease: "linear",
//                 repeat: -1,
//                 modifiers: {
//                     x: gsap.utils.unitize((x) => parseFloat(x) % -totalWidth),
//                 },
//             });

//             // 🌈 Smooth, infinite gradient color animation
//             gsap.to(".gradient-bg", {
//                 backgroundPosition: "400% center", // move background endlessly
//                 duration: 20,
//                 ease: "linear",
//                 repeat: -1,
//             });
//         }, containerRef);

//         return () => ctx.revert();
//     }, []);

//     return (
//         <div
//             ref={containerRef}
//             className="relative w-full overflow-hidden h-40 flex items-center justify-center"
//         >
//             {/* 🌈 Animated gradient background */}
//             <div className="absolute inset-0 gradient-bg bg-[linear-gradient(270deg,#ff0080,#ff8c00,#40e0d0,#ff8c00,#ff0080)] bg-size-[400%_400%] opacity-80"></div>

//             {/* 🔁 Seamless logo row */}
//             <div ref={rowRef} className="logo-row flex gap-14 relative z-10">
//                 {[...images, ...images].map((src, i) => (
//                     <Image
//                         width={100}
//                         height={100}
//                         key={i}
//                         src={src}
//                         alt={`Logo ${i}`}
//                         className="w-24 h-24 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
//                     />
//                 ))}
//             </div>

//             {/* ✨ Optional glass overlay */}
//             <div className="absolute inset-0 bg-white/5 backdrop-blur-sm z-0"></div>
//         </div>
//     );
// }


"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const images = [
    "/logos/logo-audi.png",
    "/logos/logo-bmw.png",
    "/logos/logo-mercedes.png",
    "/logos/logo-bugati.png",
    "/logos/logo-porche.png",
    "/logos/logo-tesla.png",
    "/logos/logo-ford.png",
    "/logos/logo-mini.png",
    "/logos/logo-seat.png",
    "/logos/logo-kia.png",
    "/logos/logo-toyota.png",
    "/logos/logo-chevrolet.png",
];

export default function InfiniteLogoSlider() {
    const containerRef = useRef<HTMLDivElement>(null);
    const rowRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<GSAPTween | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const row = rowRef.current;
            if (!row) return;

            const totalWidth = row.scrollWidth / 2;

            // 🔁 Infinite seamless scroll
            tweenRef.current = gsap.to(row, {
                x: -totalWidth,
                duration: 30,
                ease: "linear",
                repeat: -1,
                modifiers: {
                    x: gsap.utils.unitize((x) => parseFloat(x) % -totalWidth),
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Pause / resume on hover
    const handleMouseEnter = () => tweenRef.current?.pause();
    const handleMouseLeave = () => tweenRef.current?.play();

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden h-40 flex items-center justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* 🔁 Seamless logo row */}
            <div ref={rowRef} className="logo-row relative flex gap-14 z-10">
                {[...images, ...images].map((src, i) => (
                    <Image
                        width={100}
                        height={100}
                        key={i}
                        src={src}
                        alt={`Logo ${i}`}
                        className="md:w-24 w-16 hover:cursor-pointer h-24 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
                    />
                ))}

            </div>
            <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-linear-to-r from-black to-transparent z-20" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-linear-to-l from-black to-transparent z-20" />
        </div>
    );
}
