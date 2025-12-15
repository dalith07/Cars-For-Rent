"use client";

import { Menu } from "lucide-react";

interface TopbarProps {
    onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
    return (
        <header className="lg:hidden p-4 flex items-center justify-between bg-white border-b">
            <button onClick={onMenuClick}>
                <Menu className="w-7 h-7" />
            </button>
            <h1 className="font-semibold">Admin Panel</h1>
            <div className="w-7" />
        </header>
    );
}
