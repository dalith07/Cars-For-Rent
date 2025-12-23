import { Card, CardContent } from "@/components/ui/card"

export function StatCard({
    label,
    value,
    icon,
}: {
    label: string
    value: string
    icon: string
}) {
    return (
        <Card className="bg-card">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                        <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
                    </div>
                    <div className="text-4xl">{icon}</div>
                </div>
            </CardContent>
        </Card>
    )
}
