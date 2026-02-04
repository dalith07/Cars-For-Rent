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
                className="
    flex items-center justify-center
     w-11 h-11
    rounded-full
    border border-primary/20
    bg-primary/10
    text-primary/80
    hover:bg-primary/15
    hover:text-primary
    duration-500 hover:cursor-pointer
  "
            >
                <Globe size={22} className=' group-hover:scale-110 group-hover:rotate-360 duration-500' />
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
