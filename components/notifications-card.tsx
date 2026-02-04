"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { deleteAllUserNotifications, deleteNotificationById, getUserNotifications } from "@/actions/dashboard/notifications";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCheck, Trash2, X, Check } from "lucide-react";

type Notification = {
    id: string;
    title: string;
    message: string;
    createdAt: Date;
};

export default function NotificationsCard() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            const data = await getUserNotifications();
            setNotifications(data);
            setLoading(false);
        };

        fetchNotifications();
    }, []);

    const visibleNotifications = showAll ? notifications : notifications.slice(0, 4);

    // Delete single notification
    const handleDelete = async (id: string) => {
        setActionLoading(true);
        try {
            await deleteNotificationById(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    // Delete all notifications
    const handleDeleteAll = async () => {
        setActionLoading(true);
        try {
            await deleteAllUserNotifications();
            setNotifications([]);
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    // Mark all as read (front only for now)
    const handleMarkAll = () => {
        console.log("Mark all as read - implement backend logic if needed");
    };

    return (
        <Card
            className="absolute right-0 mt-3 w-[90vw] sm:w-96 bg-black/80 backdrop-blur-2xl border border-white/20 text-white z-50">
            <div className="p-4 space-y-3">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-sm mb-1">Notifications :</h3>
                        <p className="text-sm text-gray-400">24h remove all notify</p>
                    </div>
                    <span className="text-xs text-primary">
                        {notifications.length}
                    </span>
                </div>

                {/* ACTION BUTTONS */}
                {!loading && notifications.length > 0 && (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-1/2 text-xs hover:cursor-pointer hover:text-white bg-white/10 border-white/20 hover:bg-white/15 duration-500"
                            onClick={handleMarkAll}
                            disabled={actionLoading}
                        >
                            <CheckCheck className="w-4 h-4 mr-1" />
                            Mark all
                        </Button>

                        <Button
                            size="sm"
                            variant="destructive"
                            className="w-1/2 text-xs hover:cursor-pointer"
                            onClick={handleDeleteAll}
                            disabled={actionLoading}
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Clear all
                        </Button>
                    </div>
                )}

                {/* CONTENT */}
                <div className="relative max-h-64 overflow-y-auto pr-2 notification-scroll">

                    {/* LOADING CENTER */}
                    {loading && (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 size={32} className="animate-spin text-blue-400" />
                        </div>
                    )}

                    {!loading && notifications.length === 0 && (
                        <p className="text-center text-xs text-gray-400 py-10">
                            No new notifications
                        </p>
                    )}

                    {!loading && (
                        <div className="space-y-2">
                            {visibleNotifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className="relative p-3 rounded-lg bg-white/5 hover:bg-white/10 transition "
                                >
                                    {/* DELETE BUTTON */}
                                    <button
                                        onClick={() => handleDelete(notif.id)}
                                        disabled={actionLoading}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-400 duration-500 hover:cursor-pointer "
                                    >
                                        <X size={14} />
                                    </button>

                                    {/* DELETE BUTTON */}
                                    <button
                                        onClick={() =>
                                            setNotifications((prev) =>
                                                prev.filter((n) => n.id !== notif.id)
                                            )
                                        }
                                        className="absolute bottom-2 right-2 text-gray-400 hover:text-red-400 duration-500 hover:cursor-pointer "
                                    >
                                        <Check size={14} />
                                    </button>

                                    <p className="text-sm font-medium leading-tight pr-6">
                                        {notif.title}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 pr-6">
                                        {notif.message}
                                    </p>
                                </div>
                            ))}

                        </div>
                    )}
                </div>

                {/* VIEW ALL */}
                {!loading && notifications.length > 4 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full hover:cursor-pointer border border-blue-400/30 hover:bg-blue-400/20 text-xs text-blue-400"
                        onClick={() => setShowAll((prev) => !prev)}
                    >
                        {showAll ? "Show less" : "View all"}
                    </Button>
                )}
            </div>
        </Card>
    );
}
