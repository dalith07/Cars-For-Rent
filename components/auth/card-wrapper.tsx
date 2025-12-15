"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Header from "./header"
import Social from "./social"
import BackButton from "./back-button"

// import { Header } from "@/components/auth/header"
interface CardWrapperProps {
    children: React.ReactNode
    headerLabel: string
    backButtonLabel: string
    backButtonHref: string
    showSocial?: boolean
}

const CardWrapper = ({ children, headerLabel, backButtonLabel, backButtonHref, showSocial }: CardWrapperProps) => {
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>

            <CardContent>
                {children}
            </CardContent>

            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}

            <CardFooter className="m-auto">
                <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                />
            </CardFooter>
        </Card>
    )
}

export default CardWrapper
