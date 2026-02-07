"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "../ui/button"
import { Bell, Home } from "lucide-react"
import Link from "next/link"

interface CompanyHeaderProps {
    title: string
    description?: string
}

export function CompanyHeader({ title, description }: CompanyHeaderProps) {
    return (
        <header className="sticky top-0 z-50 flex h-[61px] items-center gap-2
                    bg-emerald-900 border-b border-emerald-800 px-6 text-white">
            <SidebarTrigger className="-ml-2" />

            <div className="flex flex-1 items-center justify-between">
                <div>
                    <h1 className="md:text-lg text-[14px] font-semibold text-accent">{title}</h1>
                    {description && <p className="lg:text-sm text-[11px] text-gray-400">{description}</p>}
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        className="
    rounded-full
    h-9 w-9 p-0
    border-emerald-600/30
    text-emerald-700
    bg-emerald-50/60
    hover:bg-emerald-100
    hover:text-emerald-800
  "
                    >
                        <Bell className="h-4 w-4" />
                    </Button>

                    <Link href={"/"} className="">
                        <Link href="/">
                            <Button
                                className="
      rounded-full
      h-9 w-9 p-0
      bg-emerald-600
      text-white
      hover:bg-emerald-700
      shadow-sm
    "
                            >
                                <Home className="h-4 w-4" />
                            </Button>
                        </Link>

                    </Link>
                </div>
            </div>
        </header>
    )
}
