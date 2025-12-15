"use client"

import { Globe } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"

const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "ar", label: "العربية" },
]

export default function LanguageSwitcher() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const ref = useRef<HTMLDivElement>(null)

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    function changeLanguage(lang: string) {
        const segments = pathname.split("/")
        segments[1] = lang // replace locale
        router.push(segments.join("/"))
        setOpen(false)
    }

    return (
        <div ref={ref} className="relative">
            {/* Globe Button */}
            <button
                onClick={() => setOpen(!open)}
                className="p-2 cursor-pointer rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition"
            >
                <Globe className="text-primary" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-[#0b0f1a] border border-white/10 shadow-lg overflow-hidden z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition"
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
