import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
    { title: "Total Cars", value: 12 },
    { title: "Available Cars", value: 7 },
    { title: "Active Rentals", value: 3 },
    { title: "Total Orders", value: 45 },
]

export function StatsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map(stat => (
                <Card key={stat.title}>
                    <CardHeader>
                        <CardTitle className="text-sm">{stat.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">
                        {stat.value}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
