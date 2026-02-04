import { useState } from "react"
import { Input } from "./ui/input"
import { Eye, EyeOff } from "lucide-react"

export function PasswordViewer({
    passwordHash,
}: {
    passwordHash?: string | null
}) {
    const [show, setShow] = useState(false)

    return (
        <div className="relative w-64">
            <Input
                type={show ? "text" : "password"}
                value={passwordHash ?? ""}
                disabled
                className="pr-10"
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                   text-muted-foreground hover:text-foreground"
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    )
}