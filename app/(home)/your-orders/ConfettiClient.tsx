/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState, } from "react"
import Confetti from "react-dom-confetti"

export default function ConfettiClient() {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => setShowConfetti(true), []);


    return (
        <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0
            overflow-hidden flex justify-center"
        >
            <Confetti
                active={showConfetti}
                config={{ elementCount: 200, spread: 90 }}
            />
        </div>
    )
}
