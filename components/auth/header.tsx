import { Poppins } from "next/font/google";

import { cn } from '@/lib/utils'
import { Car } from "lucide-react";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
})

interface HeaderProps {
    label: string
}

const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <h1 className={cn(`text-white text-lg flex gap-2 ${font.className}`)}>
                <Car className="w-8 h-8 text-blue-400 animate-bounce" /> {label}
            </h1>
        </div >
    )
}

export default Header
