"use client";

import { useState, useTransition } from "react";
import { Home } from "lucide-react";
import Link from "next/link";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/lib/validationSchema";
import { register } from "@/actions/register";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import CardWrapper from "./card-wrapper";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setSuccess("");

        startTransition(() => {
            register(values).then((data) => {
                setError(data.error);
                setSuccess(data.success);

                // if success login push user in home page 
                if (data.success) return router.push("/")
            });
        });
    };

    return (
        <CardWrapper
            headerLabel="Creaet an account"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
            showSocial
        >
            {/* BACK HOME BUTTON */}
            <Link
                href={"/"}
                className="absolute top-4 right-4 p-2 bg-blue-800 hover:bg-blue-700 transition rounded-full"
            >
                <Home className="text-white" />
            </Link>

            {/* FORM */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                    {/* NAME */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="John Doe"
                                        disabled={isPending}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* EMAIL */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        disabled={isPending}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* PASSWORD */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="********"
                                        disabled={isPending}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ERROR / SUCCESS */}
                    <FormError message={error} />
                    <FormSuccess message={success} />

                    {/* SUBMIT BUTTON */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full hover:cursor-pointer bg-blue-600 hover:bg-blue-500 text-white"
                    >
                        Create an account
                    </Button>
                </form>
            </Form>
            {/* BOTTOM LINKS */}
            {/* <div className="text-center mt-6 text-gray-400 text-sm">
                <p>
                    Already have an account?{" "}
                    <Link
                        href="/signin"
                        className="text-blue-400 hover:text-blue-300 transition"
                    >
                        Sign In
                    </Link>
                </p>
            </div> */}
        </CardWrapper>
    );
}
