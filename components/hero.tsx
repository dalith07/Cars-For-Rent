// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect, useRef } from "react";
// import gsap from "gsap";
// import { Button } from "./ui/button";
// import { useLanguage } from "@/app/language-provider";

// const Hero = () => {
//     const imageCars = [
//         "/cars/mercedes_a_class.png",
//         "/cars/golf_7.png",
//         "/cars/tesla.png",
//         "/cars/toyota_corolla-2.png",
//         "/cars/bmw-x6-1.png",
//         "/cars/Bentley-Bentayga-1.png",
//         "/cars/bmw_330i_m_sport_f30_1.png",
//         "/cars/bmw_m5_e60_1.png",
//         "/cars/bmw_m3_competition_1.png",
//     ];

//     const { t } = useLanguage();

//     const [bgImage, setBgImage] = useState(imageCars[0]);
//     const [carIndex, setCarIndex] = useState(0);

//     const bgRef = useRef<HTMLDivElement | null>(null);
//     const smallCarRef = useRef<HTMLDivElement | null>(null);

//     // Auto change bottom car every 5 seconds with smooth animation
//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (!smallCarRef.current) return;

//             // Fade-out current small car
//             gsap.to(smallCarRef.current, {
//                 opacity: 0,
//                 x: -40,
//                 scale: 0.95,
//                 duration: 0.4,
//                 ease: "power2.in",
//                 onComplete: () => {
//                     // Change image
//                     setCarIndex((prev) => (prev + 1) % imageCars.length);

//                     // Fade-in new car
//                     gsap.fromTo(
//                         smallCarRef.current,
//                         { opacity: 0, x: 80, scale: 0.9 },
//                         {
//                             opacity: 1,
//                             x: 0,
//                             scale: 1,
//                             duration: 0.9,
//                             ease: "power3.out",
//                         }
//                     );
//                 },
//             });
//         }, 5000);

//         return () => clearInterval(interval);
//     }, []);

//     // Floating animation for small car (continuous)
//     useEffect(() => {
//         if (!smallCarRef.current) return;

//         gsap.to(smallCarRef.current, {
//             y: -6,
//             repeat: -1,
//             yoyo: true,
//             duration: 2,
//             ease: "sine.inOut",
//         });
//     }, []);

//     // Handle small car click → change background smoothly
//     const handleImageClick = () => {
//         if (!bgRef.current) return;

//         gsap.to(bgRef.current, {
//             opacity: 0,
//             scale: 1.05,
//             duration: 0.6,
//             ease: "power2.out",
//             onComplete: () => {
//                 setBgImage(imageCars[carIndex]);

//                 gsap.fromTo(
//                     bgRef.current,
//                     { opacity: 0, scale: 0.95 },
//                     {
//                         opacity: 1,
//                         scale: 1,
//                         duration: 1.2,
//                         ease: "power1.out",
//                     }
//                 );
//             },
//         });
//     };

//     return (
//         <section className="relative bg-background/80 dark:bg-black/10 backdrop-blur-md w-full h-screen flex items-center justify-center overflow-hidden">

//             {/* Background Image + overlay */}
//             {/* <div ref={bgRef} className="absolute inset-0 z-0 overflow-hidden">
//                 <Image
//                     src={bgImage}
//                     alt="Hero Car"
//                     fill
//                     priority
//                     className="object-cover object-[center_60%] scale-[0.85] md:scale-[0.9]"
//                 />
//                 <div className="absolute inset-0 bg-black/30" />
//             </div> */}

//             {/* Background wrapper */}
//             <div className="absolute inset-0 z-0 overflow-hidden">

//                 {/* Animated image ONLY */}
//                 <div ref={bgRef} className="absolute inset-0">
//                     <Image
//                         src={bgImage}
//                         alt="Hero Car"
//                         fill
//                         priority
//                         quality={100}
//                         sizes="100vw"
//                         className="object-contain  object-center md:object-[center_60%]"
//                     />
//                 </div>

//                 {/* FIXED overlay (no animation) */}
//                 <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] md:backdrop-blur-xs pointer-events-none" />
//             </div>

//             {/* Main Content */}
//             <div className="relative z-20 max-w-6xl text-center px-6 text-white">
//                 <h1 className="text-4xl md:text-6xl font-bold
//                 mb-4 text-zinc-300 dark:text-white">
//                     {t("heroTitle")}
//                     <span className="text-yellow-500">{t("heroTitleHighlighted")}</span>
//                 </h1>

//                 <p className="text-gray-200 opacity-80 text-md md:text-xl mb-8">
//                     {t("heroSubtitle")}
//                 </p>

//                 <div className="flex gap-4 justify-center">
//                     <Link href="#">
//                         <Button size="lg" variant="secondary" className="hover:cursor-pointer">
//                             {t("heroExploreCars")}
//                         </Button>
//                     </Link>

//                     <Link href="/market-cars">
//                         <Button size="lg" className="hover:cursor-pointer">
//                             {t("heroRentCar")}
//                         </Button>
//                     </Link>
//                 </div>
//             </div>

//             {/* Bottom Animated Small Car */}
//             <div
//                 ref={smallCarRef}
//                 onClick={handleImageClick}
//                 className="absolute bottom-0 right-0 w-64 md:w-96 z-20 cursor-pointer"
//             >
//                 <Image
//                     src={imageCars[carIndex]}
//                     alt="Small Car"
//                     width={384}
//                     height={192}
//                     className="object-contain"
//                 />
//             </div>

//             {/* Bottom Blur */}
//             <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/30 to-transparent z-20" />

//         </section>
//     );
// };

// export default Hero;

/////////////////////////////////////////////////////////////////////

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect, useRef } from "react";
// import gsap from "gsap";
// import { Button } from "./ui/button";
// import { useLanguage } from "@/app/language-provider";
// import { BadgeDollarSign, Clock3, ShieldCheck } from "lucide-react";

// const Hero = () => {
//     const imageCars = [
//         "/cars/mercedes_a_class.png",
//         "/cars/golf_7.png",
//         "/cars/tesla.png",
//         "/cars/toyota_corolla-2.png",
//         "/cars/bmw-x6-1.png",
//     ];

//     const { t } = useLanguage();

//     const [carIndex, setCarIndex] = useState(0);
//     const smallCarRef = useRef<HTMLDivElement | null>(null);
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const bgCarRef = useRef<HTMLDivElement | null>(null);

//     // auto change small car only
//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (!smallCarRef.current) return;

//             gsap.to(smallCarRef.current, {
//                 opacity: 0,
//                 x: -40,
//                 scale: 0.9,
//                 duration: 0.4,
//                 onComplete: () => {
//                     setCarIndex((prev) => (prev + 1) % imageCars.length);

//                     gsap.fromTo(
//                         smallCarRef.current,
//                         { opacity: 0, x: 60, scale: 0.9 },
//                         { opacity: 1, x: 0, scale: 1, duration: 0.7 }
//                     );
//                 },
//             });
//         }, 5000);

//         return () => clearInterval(interval);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     // floating animation
//     useEffect(() => {
//         if (!smallCarRef.current) return;

//         gsap.to(smallCarRef.current, {
//             y: -10,
//             repeat: -1,
//             yoyo: true,
//             duration: 2,
//             ease: "sine.inOut",
//         });
//     }, []);

//     return (
//         <section className="relative h-screen w-full overflow-hidden bg-black">

//             {/* ================= BACKGROUND CAR (IMPORTANT PART) ================= */}
//             <div className="absolute inset-0 z-0 flex items-center justify-center">
//                 <div className="relative w-[120%] h-[120%] scale-110 blur-[2px]">
//                     <Image
//                         src="/hero-image-bg.png"
//                         alt="background"
//                         fill
//                         className="object-contain"
//                     />
//                 </div>
//             </div>

//             {/* dark overlay gradient */}
//             <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black" />

//             {/* glow */}
//             <div className="absolute right-20 top-1/2 h-[500px] w-[500px] -translate-y-1/2 bg-yellow-500/10 blur-[140px]" />

//             {/* ================= CONTENT ================= */}
//             <div className="relative z-10 flex h-full items-center justify-between px-10">

//                 {/* LEFT */}
//                 <div className="max-w-xl text-white">
//                     <h1 className="text-5xl md:text-6xl font-bold leading-tight">
//                         {t("heroTitle")}{" "}
//                         <span className="text-yellow-400">
//                             {t("heroTitleHighlighted")}
//                         </span>
//                     </h1>

//                     <p className="mt-6 text-gray-300 text-lg">
//                         {t("heroSubtitle")}
//                     </p>

//                     <div className="mt-8 flex gap-4">
//                         <Link href="#">
//                             <Button>{t("heroExploreCars")}</Button>
//                         </Link>

//                         <Link href="/market-cars">
//                             <Button variant="outline">{t("heroRentCar")}</Button>
//                         </Link>
//                     </div>

//                     <div className="mt-12 flex flex-row gap-4">
//                         {/* Safe */}
//                         <div className="flex items-start gap-3">
//                             <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 p-3">
//                                 <ShieldCheck className="h-6 w-6 text-yellow-400" />
//                             </div>

//                             <div>
//                                 <h4 className="font-semibold text-white">
//                                     Safe & Secure
//                                 </h4>

//                                 <p className="text-sm text-gray-400">
//                                     Your safety is our top priority.
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Best Price */}
//                         <div className="flex items-start gap-3">
//                             <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 p-3">
//                                 <BadgeDollarSign className="h-6 w-6 text-yellow-400" />
//                             </div>

//                             <div>
//                                 <h4 className="font-semibold text-white">
//                                     Best Price
//                                 </h4>

//                                 <p className="text-sm text-gray-400">
//                                     Get the best deals on premium cars.
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Support */}
//                         <div className="flex items-start gap-3">
//                             <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 p-3">
//                                 <Clock3 className="h-6 w-6 text-yellow-400" />
//                             </div>

//                             <div>
//                                 <h4 className="font-semibold text-white">
//                                     24/7 Support
//                                 </h4>

//                                 <p className="text-sm text-gray-400">
//                                     We&#39;re here to help anytime.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                 </div>


//                 {/* RIGHT SMALL CAR */}
//                 <div
//                     ref={smallCarRef}
//                     className="w-[500px] cursor-pointer"
//                 >
//                     <Image
//                         src={imageCars[carIndex]}
//                         alt="car"
//                         width={600}
//                         height={400}
//                         className="object-contain"
//                     />
//                 </div>

//             </div>

//             {/* bottom fade */}
//             <div className="pointer-events-none absolute bottom-0 h-32 w-full bg-linear-to-t from-black to-transparent" />

//         </section>
//     );
// };

// export default Hero;

/////////////////////////////////////////////////////////////////////////////

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "./ui/button";
import { useLanguage } from "@/app/language-provider";
import { BadgeDollarSign, Clock3, ShieldCheck } from "lucide-react";

const Hero = () => {
    const imageCars = [
        "/cars/mercedes_a_class.png",
        "/cars/golf_7.png",
        "/cars/tesla.png",
        "/cars/toyota_corolla-2.png",
        "/cars/bmw-x6-1.png",
    ];

    const { t } = useLanguage();

    const [carIndex, setCarIndex] = useState(0);
    const smallCarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!smallCarRef.current) return;

            gsap.to(smallCarRef.current, {
                opacity: 0,
                x: -40,
                scale: 0.9,
                duration: 0.4,
                onComplete: () => {
                    setCarIndex((prev) => (prev + 1) % imageCars.length);

                    gsap.fromTo(
                        smallCarRef.current,
                        { opacity: 0, x: 60, scale: 0.9 },
                        { opacity: 1, x: 0, scale: 1, duration: 0.7 }
                    );
                },
            });
        }, 5000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!smallCarRef.current) return;

        gsap.to(smallCarRef.current, {
            y: -10,
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: "sine.inOut",
        });
    }, []);

    return (
        // dark + isolate: this section always renders in dark mode visually,
        // regardless of the app's light/dark theme class, so bg + text never break
        <section className="dark relative isolate min-h-screen w-full overflow-hidden bg-black">

            {/* ================= BACKGROUND CAR ================= */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-image-bg.png"
                        alt="background"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center blur-[1px] md:blur-[2px]"
                    />
                </div>
            </div>

            {/* dark overlay gradient - always dark, fixed */}
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black" />

            {/* glow */}
            <div className="absolute right-4 top-1/2 h-[300px] w-[300px] -translate-y-1/2 bg-yellow-500/10 blur-[100px] md:right-20 md:h-[500px] md:w-[500px] md:blur-[140px]" />

            {/* ================= CONTENT ================= */}
            <div className="relative z-10 flex min-h-screen w-full flex-col-reverse items-center justify-center gap-10 px-6 py-24 md:flex-row md:items-center md:justify-between md:px-10 md:py-0">

                {/* LEFT */}
                <div className="max-w-xl text-center text-white md:text-left">
                    <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                        {t("heroTitle")}{" "}
                        <span className="text-yellow-400">
                            {t("heroTitleHighlighted")}
                        </span>
                    </h1>

                    <p className="mt-4 text-base text-gray-300 md:mt-6 md:text-lg">
                        {t("heroSubtitle")}
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-4 md:mt-8 md:justify-start">
                        <Link href="#">
                            <Button>{t("heroExploreCars")}</Button>
                        </Link>

                        <Link href="/market-cars">
                            <Button variant="outline">{t("heroRentCar")}</Button>
                        </Link>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {/* Safe */}
                        <div className="flex items-start gap-3 text-left">
                            <div className="shrink-0 rounded-full border border-yellow-500/30 bg-yellow-500/10 p-3">
                                <ShieldCheck className="h-6 w-6 text-yellow-400" />
                            </div>

                            <div>
                                <h4 className="font-semibold text-white">
                                    Safe & Secure
                                </h4>

                                <p className="text-sm text-gray-400">
                                    Your safety is our top priority.
                                </p>
                            </div>
                        </div>

                        {/* Best Price */}
                        <div className="flex items-start gap-3 text-left">
                            <div className="shrink-0 rounded-full border border-yellow-500/30 bg-yellow-500/10 p-3">
                                <BadgeDollarSign className="h-6 w-6 text-yellow-400" />
                            </div>

                            <div>
                                <h4 className="font-semibold text-white">
                                    Best Price
                                </h4>

                                <p className="text-sm text-gray-400">
                                    Get the best deals on premium cars.
                                </p>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="flex items-start gap-3 text-left">
                            <div className="shrink-0 rounded-full border border-yellow-500/30 bg-yellow-500/10 p-3">
                                <Clock3 className="h-6 w-6 text-yellow-400" />
                            </div>

                            <div>
                                <h4 className="font-semibold text-white">
                                    24/7 Support
                                </h4>

                                <p className="text-sm text-gray-400">
                                    We&#39;re here to help anytime.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT SMALL CAR */}
                <div
                    ref={smallCarRef}
                    className="w-[220px] shrink-0 cursor-pointer sm:w-[320px] md:w-[420px] lg:w-[500px]"
                >
                    <Image
                        src={imageCars[carIndex]}
                        alt="car"
                        width={600}
                        height={400}
                        className="h-auto w-full object-contain"
                        priority
                    />
                </div>

            </div>

            {/* bottom fade */}
            <div className="pointer-events-none absolute bottom-0 h-32 w-full bg-linear-to-t from-black to-transparent" />

        </section>
    );
};

export default Hero;