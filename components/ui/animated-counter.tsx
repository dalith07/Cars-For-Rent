"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

type AnimatedCounterProps = {
    value: number
    duration?: number
}

export default function AnimatedCounter({
    value,
    duration = 2.2,
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (!ref.current) return

        gsap.fromTo(
            ref.current,
            { innerText: 0 },
            {
                innerText: value,
                duration,
                ease: "power2.out",
                snap: { innerText: 1 },
            }
        )
    }, [value, duration])

    return <span ref={ref}>0</span>
}
