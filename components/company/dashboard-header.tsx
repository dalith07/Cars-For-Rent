export function DashboardHeader({
    title,
    description,
}: {
    title: string
    description?: string
}) {
    return (
        <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
    )
}
