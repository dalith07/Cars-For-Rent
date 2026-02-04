import Link from "next/link"


interface BackButtonProps {
    label: string
    href: string
}

const BackButton = ({ href, label }: BackButtonProps) => {
    return (
        <span className="m-auto text-accent-foreground text-sm hover:underline duration-500">
            <Link href={href} className="text-accent-foreground">{label}</Link>
        </span>
    )
}

export default BackButton
