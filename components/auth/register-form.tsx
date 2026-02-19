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
                                <FormLabel className="text-accent-foreground text-sm">Name:</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="John Doe"
                                        disabled={isPending}
                                        className="bg-blue-600/10 border-blue-600/50 text-accent-foreground focus:border-blue-600/70 duration-500 transition-colors pr-10"
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
                                <FormLabel className="text-accent-foreground text-sm">Email:</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        disabled={isPending}
                                        className="bg-blue-600/10 border-blue-600/50 text-accent-foreground focus:border-blue-600/70 duration-500 transition-colors pr-10"
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
                                <FormLabel className="text-accent-foreground text-sm">Password:</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="********"
                                        disabled={isPending}
                                        className="bg-blue-600/10 border-blue-600/50 text-accent-foreground focus:border-blue-600/70 duration-500 transition-colors pr-10"
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
                        className="w-full hover:cursor-pointer bg-blue-600/70 hover:bg-blue-600/50 hover:text-white border-blue-600  border duration-500 text-white">
                        Create an account
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
