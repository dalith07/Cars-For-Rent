"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Info, TrendingUp } from "lucide-react"
import gsap from "gsap"

const activities = [
    { icon: CheckCircle, label: "Sale completed", time: "2 mins ago", color: "text-green-500" },
    { icon: TrendingUp, label: "Revenue peak reached", time: "15 mins ago", color: "text-blue-500" },
    { icon: AlertCircle, label: "System update done", time: "1 hour ago", color: "text-yellow-500" },
    { icon: Info, label: "New user registered", time: "2 hours ago", color: "text-cyan-500" },
    { icon: CheckCircle, label: "Report generated", time: "3 hours ago", color: "text-green-500" },
]

export default function ActivityFeed() {
    const feedRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".activity-item", {
                duration: 0.5,
                opacity: 0,
                x: 15,
                stagger: 0.08,
                ease: "power2.out",
            })
        })

        return () => ctx.revert()
    }, [])

    return (
        <Card ref={feedRef} className="border-border bg-card h-full overflow-hidden">
            <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div
                            key={index}
                            className="activity-item flex items-start gap-3 pb-3 last:pb-0 border-b border-border/50 last:border-0"
                        >
                            <activity.icon className={`w-5 h-5 ${activity.color} flex-shrink-0 mt-0.5`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{activity.label}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
