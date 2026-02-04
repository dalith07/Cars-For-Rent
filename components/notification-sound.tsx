/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useRef } from "react"

export default function NotificationSound({ notifications }: { notifications: any[] }) {
    const prevCount = useRef(notifications.length)

    useEffect(() => {
        if (notifications.length > prevCount.current) {
            const audio = new Audio("/sounds/sound_notify.mp3")
            audio.play()
        }
        prevCount.current = notifications.length
    }, [notifications])

    return null
}
