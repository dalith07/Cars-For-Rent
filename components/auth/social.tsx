"use client"

import { Button } from "../ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { signIn } from "next-auth/react"
import { DEFAULT_LOGIN_REDIRECT } from "@/route"

const Social = () => {
    const onClick = (provider: "google" | "github") => {
        signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT
        });
    }
    return (
        <div className="flex items-center justify-center gap-4 w-full">
            <Button
                size="lg"
                className="flex items-center justify-center w-1/2"
                variant="outline"
                onClick={() => onClick("google")}
            >
                <FcGoogle className="h-5 w-5" />
            </Button>

            <Button
                size="lg"
                className="flex items-center justify-center w-1/2"
                variant="outline"
                onClick={() => onClick("github")}
            >
                <FaGithub className="h-5 w-5 text-gray-700" />
            </Button>
        </div >
    )
}

export default Social
