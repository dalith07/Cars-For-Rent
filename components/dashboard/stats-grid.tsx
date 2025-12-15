"use client"

import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, DollarSign, Activity } from "lucide-react"
import { motion, } from "framer-motion"
import { useEffect, useState } from "react"

const stats = [
    {
        title: "Total Revenue",
        value: 124850,
        change: 12.5,
        positive: true,
        icon: DollarSign,
        gradient: "from-blue-400 to-blue-500",
        bgColor: "bg-blue-50",
        iconColor: "text-blue-500",
        prefix: "$",
    },
    {
        title: "Active Users",
        value: 8234,
        change: 8.2,
        positive: true,
        icon: Users,
        gradient: "from-purple-400 to-purple-500",
        bgColor: "bg-purple-50",
        iconColor: "text-purple-500",
    },
    {
        title: "Growth Rate",
        value: 23.5,
        change: 4.3,
        positive: true,
        icon: TrendingUp,
        gradient: "from-green-400 to-green-500",
        bgColor: "bg-green-50",
        iconColor: "text-green-500",
        suffix: "%",
    },
    {
        title: "Total Activity",
        value: 12543,
        change: -2.1,
        positive: false,
        icon: Activity,
        gradient: "from-orange-400 to-orange-500",
        bgColor: "bg-orange-50",
        iconColor: "text-orange-500",
    },
]

export default function StatsGrid() {
    const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0))

    useEffect(() => {
        const increments = stats.map((stat, idx) => {
            const target = stat.value
            let current = 0
            const step = target / 60 // 60 frames
            const interval = setInterval(() => {
                current += step
                if (current >= target) {
                    current = target
                    clearInterval(interval)
                }
                setAnimatedValues((prev) => {
                    const newVals = [...prev]
                    newVals[idx] = current
                    return newVals
                })
            }, 16) // ~60fps
            return interval
        })

        return () => increments.forEach(clearInterval)
    }, [])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                    className="group relative bg-card border border-border rounded-xl p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 cursor-pointer"
                >
                    <div
                        className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />

                    <div className="relative z-10">
                        {/* Icon */}
                        <div className={`${stat.bgColor} w-fit p-3 rounded-lg mb-4`}>
                            <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                        </div>

                        {/* Stats */}
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                            <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                                {stat.prefix ?? ""}
                                {Math.round(animatedValues[index])}
                                {stat.suffix ?? ""}
                            </h3>
                        </div>

                        {/* Change */}
                        <div className="flex items-center gap-2 mt-4">
                            {stat.positive ? (
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-500" />
                            )}
                            <span
                                className={
                                    stat.positive
                                        ? "text-green-500 text-sm font-semibold"
                                        : "text-red-500 text-sm font-semibold"
                                }
                            >
                                {stat.positive ? "+" : ""}
                                {stat.change}%
                            </span>
                            <span className="text-muted-foreground text-sm">vs last month</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
