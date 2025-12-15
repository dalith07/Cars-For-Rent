/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useRef } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import gsap from "gsap"

const lineData = [
    { name: "Mon", value: 400, target: 420 },
    { name: "Tue", value: 520, target: 500 },
    { name: "Wed", value: 480, target: 490 },
    { name: "Thu", value: 620, target: 600 },
    { name: "Fri", value: 750, target: 700 },
    { name: "Sat", value: 920, target: 900 },
    { name: "Sun", value: 850, target: 880 },
]

const barData = [
    { name: "Q1", revenue: 45000, profit: 12000 },
    { name: "Q2", revenue: 52000, profit: 15000 },
    { name: "Q3", revenue: 48000, profit: 14000 },
    { name: "Q4", revenue: 61000, profit: 18000 },
]

export default function ChartsSection() {
    const chartRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (chartRef.current) {
                gsap.from(chartRef.current, {
                    duration: 0.8,
                    opacity: 0,
                    y: 30,
                    ease: "power2.out",
                    delay: 0.2,
                })
            }
        })

        return () => ctx.revert()
    }, [])

    return (
        <div ref={chartRef} className="space-y-5">
            {/* Revenue Chart */}
            <Card className="border-border bg-white/80 hover:shadow-md transition-shadow">
                <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-lg font-bold text-foreground">Revenue Trend</CardTitle>
                </CardHeader>

                <CardContent className="pt-6 bg-linear-to-br from-blue-50/50 to-transparent rounded-lg">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                                    border: "2px solid #3b82f6",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                                }}
                                labelStyle={{ color: "#000" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: "#3b82f6", r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="target"
                                stroke="#f59e0b"
                                strokeWidth={2.5}
                                strokeDasharray="5 5"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Quarterly Performance */}
            {/* <Card className="border-border bg-white/80 hover:shadow-md transition-shadow">
                <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-lg font-bold text-foreground">Quarterly Performance</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 bg-linear-to-br from-green-50/50 to-transparent rounded-lg">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                                    border: "2px solid #10b981",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
                                }}
                                labelStyle={{ color: "#000" }}
                            />
                            <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card> */}
        </div>
    )
}
