/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Bell, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useCurrentUser } from "@/hooks/use-current-user"
import Image from "next/image"

interface AdminHeaderProps {
    title: string
    description?: string
}

export function AdminHeader({ title, description }: AdminHeaderProps) {

    const user = useCurrentUser();

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-gray-900/90 backdrop-blur sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold tracking-tight text-slate-100">{title}</h1>
                    {description && <p className="text-xs text-slate-400 leading-none">{description}</p>}
                </div>
            </div>

            <div className="flex items-center gap-2">

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="hover:cursor-pointer flex items-center gap-2 px-2 hover:bg-slate-800 hover:text-white rounded-full h-9">
                            <td className="py-4">
                                <div className="flex items-center gap-3">
                                    {user?.image ? (
                                        <Image
                                            src={user.image}
                                            alt={user?.name || "avatar"}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white font-semibold">
                                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                    )}

                                    <span className="font-medium text-sm">
                                        {user?.name}
                                    </span>
                                </div>
                            </td>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                        <DropdownMenuItem>Security Logs</DropdownMenuItem>
                        <DropdownMenuItem>System Status</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:cursor-pointer relative h-9 w-9 rounded-full">
                            <Bell className="h-4 w-4" />
                            {/* Badge notification */}
                            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full border-2 border-background" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-72 p-2 space-y-2">
                        <DropdownMenuLabel className="font-bold">Notifications</DropdownMenuLabel>

                        {/* Static notifications example  */}
                        <div className="space-y-2">
                            <div className="p-2 rounded-md border hover:bg-accent cursor-pointer">
                                <p className="text-sm font-medium">New User Registered</p>
                                <span className="text-xs text-muted-foreground">2 minutes ago</span>
                            </div>

                            <div className="p-2 rounded-md border hover:bg-accent cursor-pointer">
                                <p className="text-sm font-medium">New Message from Mohamed</p>
                                <span className="text-xs text-muted-foreground">10 minutes ago</span>
                            </div>

                            <div className="p-2 rounded-md border hover:bg-accent cursor-pointer">
                                <p className="text-sm font-medium">Server Backup Completed</p>
                                <span className="text-xs text-muted-foreground">1 hour ago</span>
                            </div>
                        </div>

                        <DropdownMenuSeparator />
                        <Link href="/dashboard/chat">
                            <Button variant="outline" className="hover:cursor-pointer w-full text-xs">View All</Button>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Link href={"/"}>
                    <Button size="icon" className="hover:cursor-pointer relative h-9 w-9 rounded-full">
                        <Home className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </header>
    )
}
