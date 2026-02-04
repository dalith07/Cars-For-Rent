/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Info, AlertTriangle, Terminal, Clock, RefreshCcw, Filter, Loader2, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/dashboard/admin-header";
import { useEffect, useState, useCallback } from "react";
import { deleteAllLogs, getLogs } from "@/actions/dashboard/logs";

type Log = {
    time: string;
    type: "INFO" | "WARN" | "ERROR";
    msg: string;
    details?: any;
};

type FilterType = "INFO" | "WARN" | "ERROR" | "ALL";

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<FilterType>("ALL");
    const [expandedLogIndex, setExpandedLogIndex] = useState<number | null>(null);

    // fetch logs from server action
    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getLogs(100, filterType);
            setLogs(
                data.map((l: any) => ({
                    type: l.type,
                    msg: l.message,
                    details: l.details ? (typeof l.details === 'string' ? JSON.parse(l.details) : l.details) : null,
                    time: new Date(l.createdAt).toLocaleString(),
                }))
            );
        } catch (err) {
            console.error("Failed to fetch logs", err);
        } finally {
            setLoading(false);
        }
    }, [filterType]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const getColor = (type: Log["type"]) => {
        switch (type) {
            case "INFO":
                return "text-emerald-400";
            case "WARN":
                return "text-amber-400";
            case "ERROR":
                return "text-rose-400";
        }
    };

    const getIcon = (type: Log["type"]) => {
        switch (type) {
            case "INFO":
                return Info;
            case "WARN":
                return AlertTriangle;
            case "ERROR":
                return ShieldAlert;
        }
    };

    // inside your component:
    const handleRemoveAll = async () => {
        try {
            setLoading(true);
            const result = await deleteAllLogs();
            if (result.success) {
                setLogs([]); // clear local state
            } else {
                console.error("Error removing logs:", result.error);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1">
            <AdminHeader
                title="System Logs"
                description="Audit trails and real-time event monitoring"
            />

            <main className="flex-1 p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="bg-slate-800 hover:text-white hover:bg-slate-700 border-slate-700">
                            <Clock className="mr-2 h-4 w-4" /> Last 24 Hours
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className={cn(
                                "bg-background",
                                filterType === "ALL" && "bg-slate-800 border-slate-700 hover:text-white hover:bg-slate-700"
                            )}
                            onClick={() => setFilterType("ALL")}
                        >
                            <Filter className="mr-2 h-4 w-4" /> Level: All
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="destructive"
                            className="text-white hover:cursor-pointer font-medium"
                            onClick={handleRemoveAll}
                            disabled={loading}
                        >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Remove All
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary hover:bg-transparent border hover:text-primary border-slate-700 hover:cursor-pointer font-medium"
                            onClick={fetchLogs}
                            disabled={loading}
                        >
                            <RefreshCcw className={cn("mr-2 h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
                        </Button>
                    </div>
                </div>

                <Card className="border-none shadow-sm bg-zinc-950 text-zinc-50 font-mono text-[13px] overflow-hidden">
                    <CardHeader className="border-b border-zinc-800 bg-zinc-900/50">
                        <div className="flex items-center gap-2">
                            <Terminal className="h-4 w-4 text-emerald-400" />
                            <CardTitle className="text-sm font-medium">Real-time Stream</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                        <div className="divide-y divide-zinc-800">
                            {loading ? (
                                <div className="p-4 flex items-center justify-center text-zinc-400">
                                    <Loader2 className="animate-spin" size={30} />
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="p-4 text-center text-zinc-400">No logs found.</div>
                            ) : (
                                logs.map((log, i) => {
                                    const Icon = getIcon(log.type);
                                    const isExpanded = expandedLogIndex === i;

                                    return (
                                        <div key={i} className="p-4 hover:bg-zinc-900/50 transition-colors flex flex-col gap-2">
                                            <div className="flex items-start gap-4 w-full">
                                                <span className="text-zinc-500 shrink-0">{log.time}</span>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Icon className={cn("h-4 w-4", getColor(log.type))} />
                                                    <span className={cn("font-bold w-16", getColor(log.type))}>
                                                        [{log.type}]
                                                    </span>
                                                </div>
                                                <p className="text-zinc-300 leading-relaxed flex-1">{log.msg}</p>

                                                {log.details && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            setExpandedLogIndex(isExpanded ? null : i)
                                                        }
                                                        className="text-white bg-primary/10 duration-500 border-primary/50 hover:bg-primary/20 hover:cursor-pointer hover:text-white "
                                                    >
                                                        {isExpanded ? "Hide Details" : "Show Details"}
                                                    </Button>
                                                )}
                                            </div>

                                            {isExpanded && log.details && (
                                                <pre className="ml-20 text-zinc-400 text-[12px] bg-zinc-900/50 p-2 rounded">
                                                    {JSON.stringify(log.details, null, 2)}
                                                </pre>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
