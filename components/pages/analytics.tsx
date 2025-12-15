"use client"

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const monthlyData = [
    { month: "Jan", revenue: 4000, users: 2400 },
    { month: "Feb", revenue: 3000, users: 1398 },
    { month: "Mar", revenue: 2000, users: 9800 },
    { month: "Apr", revenue: 2780, users: 3908 },
    { month: "May", revenue: 1890, users: 4800 },
    { month: "Jun", revenue: 2390, users: 3800 },
]

export default function AnalyticsPage() {
    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
                <p className="text-muted-foreground">Track your business metrics and performance trends.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="animate-scale-in">
                    <CardHeader>
                        <CardTitle>Monthly Revenue</CardTitle>
                        <CardDescription>Revenue trends over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>Active users trend</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="users" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
