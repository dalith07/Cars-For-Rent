import { Button } from "@/components/ui/button"
import Link from "next/link"


interface BackButtonProps {
    label: string
    href: string
}

const BackButton = ({ href, label }: BackButtonProps) => {
    return (
        <Button className="m-auto">
            <Link href={href}>{label}</Link>
        </Button>
    )
}

export default BackButton
