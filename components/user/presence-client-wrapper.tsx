"use client"

import { pingUser } from "@/actions/user/presence"
import { useEffect } from "react"

export default function PresenceClientWrapper() {
    useEffect(() => {
        // ping immediately
        pingUser()

        const interval = setInterval(() => {
            pingUser()
        }, 15000) // every 15s

        return () => clearInterval(interval)
    }, [])

    return null
}
