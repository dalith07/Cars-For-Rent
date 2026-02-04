/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useRef } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import NotificationSound from "../notification-sound"

export default function NotificationClientWrapper() {
    const user = useCurrentUser()
    const [notifications, setNotifications] = useState<any[]>([])
    const previousCount = useRef(0)

    async function loadNotifications() {
        if (!user?.id) return
        const res = await fetch(`/api/notifications?userId=${user.id}`)
        const data = await res.json()

        // 🔥 detect new notification = play sound
        if (data.length > previousCount.current) {
            new Audio("/sounds/notify.mp3").play()
        }

        previousCount.current = data.length
        setNotifications(data)
    }

    useEffect(() => {
        loadNotifications()
        const interval = setInterval(loadNotifications, 4000) // polling each 4s
        return () => clearInterval(interval)
    }, [user?.id])

    return <NotificationSound notifications={notifications} />
}
