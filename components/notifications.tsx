import { getUserNotifications } from "@/actions/dashboard/notifications"

export default async function NotificationsPage() {
    const notifications = await getUserNotifications()

    return (
        <div className="min-h-screen px-4 py-10 text-white">
            <div className="mx-auto max-w-3xl space-y-6">

                {/* Title */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <span className="text-sm text-muted-foreground">
                        {notifications.length} total
                    </span>
                </div>

                {/* Empty state */}
                {notifications.length === 0 && (
                    <div className="rounded-lg border border-dashed border-white/20 p-10 text-center text-muted-foreground">
                        No notifications yet 📭
                    </div>
                )}

                {/* Notifications list */}
                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`rounded-lg border p-4 transition
                ${n.read
                                    ? "bg-muted/40 border-white/10"
                                    : "bg-white/10 border-white/20 hover:bg-white/15"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold">{n.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {n.message}
                                    </p>
                                </div>

                                {!n.read && (
                                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}
