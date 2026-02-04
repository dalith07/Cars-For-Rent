"use client"

import { Button } from "../ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaApple, } from "react-icons/fa"
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
                className="flex text-accent-foreground text-xs hover:cursor-pointer items-center justify-center w-1/2 bg-background border-blue-400/50"
                variant="outline"
                onClick={() => onClick("google")}
            >
                <FcGoogle size={24} className="text-accent-foreground" /> Login with google
            </Button>

            {/* <Button
                size="lg"
                className="flex text-xs hover:cursor-pointer items-center justify-center w-1/2"
                variant="outline"
                onClick={() => onClick("github")}
            >
                <FaGithub className="h-5 w-5 text-gray-700" /> Login with github
            </Button> */}

            <Button
                size="lg"
                className="flex text-accent-foreground text-xs hover:cursor-pointer items-center justify-center w-1/2 bg-background border-blue-400/50"
                variant="outline"
            // onClick={() => onClick("github")}
            >
                <FaApple size={24} className="text-accent-foreground" />  Login with Apple
            </Button>
        </div >
    )
}

export default Social
