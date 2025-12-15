"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"

const metrics = [
    { label: "CPU Usage", value: "34%", change: "+5%", trend: "up" },
    { label: "Memory Usage", value: "67%", change: "-3%", trend: "down" },
    { label: "Disk Usage", value: "45%", change: "+2%", trend: "up" },
    { label: "Network", value: "120 Mbps", change: "+15%", trend: "up" },
]

export default function PerformancePage() {
    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">Performance</h1>
                <p className="text-muted-foreground">Monitor system performance metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                                </div>
                                {metric.trend === "up" ? (
                                    <ArrowUp className="w-5 h-5 text-destructive" />
                                ) : (
                                    <ArrowDown className="w-5 h-5 text-green-500" />
                                )}
                            </div>
                            <p className={`text-sm ${metric.trend === "up" ? "text-destructive" : "text-green-500"}`}>
                                {metric.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
