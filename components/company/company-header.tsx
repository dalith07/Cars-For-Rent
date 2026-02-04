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
            {/* <div className="flex flex-1 flex-col">
                <h1 className="text-lg font-semibold">{title}</h1>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div> */}

            <div className="flex flex-1 items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">{title}</h1>
                    {description && <p className="text-sm text-gray-300">{description}</p>}
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="hover:cursor-pointer text-black">
                        <Bell />
                    </Button>

                    <Link href={"/"} className="">
                        <Button className="hover:cursor-pointer">
                            <Home />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
