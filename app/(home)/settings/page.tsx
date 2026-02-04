/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import Image from "next/image";
import Dropzone, { FileRejection } from "react-dropzone";
import { toast } from "sonner";
import { FileImage } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ProfileSchema } from "@/lib/validationSchema";
import { useUploadThing } from "@/lib/uploadthing";
import { createOrUpdateProfile, updateUserProfile } from "@/actions/profile";
import { getUserProfile } from "@/actions/dashboard/users";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const user = useCurrentUser();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();
    const { update } = useSession();

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            phoneNumber: "",
            streetAddress: "",
            postalCode: "",
            city: "",
            image: "",
        },
    });

    // load profile
    useEffect(() => {
        if (!user?.id) return;

        const load = async () => {
            const profile = await getUserProfile(user.id);

            if (profile) {
                form.reset({
                    phoneNumber: profile.phoneNumber || "",
                    streetAddress: profile.streetAddress || "",
                    postalCode: profile.postalCode || "",
                    city: profile.city || "",
                    image: user.image || "",
                });
            }

            setImagePreview(user.image || null);
        };

        load();
    }, [user?.id]);

    // page animation
    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(".anim", {
                opacity: 0,
                y: 40,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                clearProps: "all", // 🔥 مهم برشا
            });
        }, containerRef);

        return () => ctx.revert(); // 🔥 cleanup
    }, []);

    // progress animation
    useEffect(() => {
        if (!progressRef.current) return;

        gsap.to(progressRef.current, {
            width: `${uploadProgress}%`,
            duration: 0.4,
            ease: "power2.out",
        });
    }, [uploadProgress]);

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: async ([data]) => {
            setImagePreview(data.ufsUrl)
            form.setValue("image", data.ufsUrl);
            setUploadProgress(0);
            toast.success("Image uploaded successfully");
        },
        onUploadProgress(p: number) {
            setUploadProgress(p);
        }, onUploadError(error) {
            toast.error("Upload failed: " + error.message);
            setUploadProgress(0);
        },
    });

    const onDropAccepted = (acceptedFiles: File[]) => {
        startUpload(acceptedFiles, { configId: undefined });
    };

    const onDropRejected = (rejectedFiles: FileRejection[]) => { };

    const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
        if (!user?.id) return;

        startTransition(() => {
            updateUserProfile(values, user.id).then(async (res) => {
                if (res?.error) {
                    toast.error(res.error);
                    return;
                }

                if (res?.success) {
                    // 🔥 update session
                    await update({
                        image: values.image,
                    });

                    setImagePreview(values.image || null);
                    toast.success(res.success);
                }
            });
        });
        console.log("NEW IMAGE:😍😍", values.image);
        console.log("SESSION IMAGE😍😍:😍😍", user?.image);
        // startTransition(() => {
        //     createOrUpdateProfile(values, user.id).then(async (res) => {
        //         if (res?.error) toast.error(res.error);
        //         if (res?.success) toast.success(res.success);
        //         // if (res?.success) {
        //         //     await update(); // 🔥 يحدّث user.image في session
        //         //     toast.success(res.success);
        //         // }
        //     });
        // });
    };



    return (
        <div
            ref={containerRef}
            className="min-h-screen mt-12 flex justify-center items-center"
        >
            <div className="anim w-full max-w-4xl p-10 rounded-3xl bg-primary/20 border-primary/20 dark:bg-background  border dark:border-accent">
                <h1 className="anim text-4xl text-accent-foreground font-semibold text-center mb-10">
                    Profile
                </h1>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* IMAGE */}
                    <div className="anim flex flex-col items-center gap-4">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-3 border-primary/50">
                            <Image
                                src={imagePreview || "/logo_user.png"}
                                alt="Profile"
                                width={160}
                                height={160}
                                className="object-cover select-none"
                            />
                        </div>

                        {/* UPLOAD LOGO */}
                        <Dropzone
                            accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                            onDropAccepted={onDropAccepted}
                            onDropRejected={onDropRejected}
                            onDragEnter={() => setIsDragOver(true)}
                            onDragLeave={() => setIsDragOver(false)}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div
                                    {...getRootProps()}
                                    className={`anim-item p-3 text-sm rounded-lg text-center cursor-pointer transition
                                   ${isDragOver ? "border-blue-400 bg-blue-800/30" : "border-gray-400"}`}
                                >
                                    <input {...getInputProps()} />
                                    <span className="block border border-dashed border-primary rounded-lg p-2 mt-2 text-center cursor-pointer font-semibold">
                                        {uploadProgress > 0 ? (
                                            <div className="w-full">
                                                <Progress
                                                    value={uploadProgress}
                                                    className="my-2 w-24 h-2 bg-gray-300"
                                                />
                                                <p className="text-xs text-accent-foreground mt-1">{uploadProgress}%</p>
                                            </div>
                                        ) : (
                                            <span className="flex flex-row items-center text-accent-foreground gap-2">
                                                <FileImage className="text-primary" /> Uplaod Image
                                            </span>
                                        )}
                                    </span>
                                </div>
                            )}
                        </Dropzone>
                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="anim flex flex-col gap-4"
                    >
                        <Input
                            disabled
                            value={user?.name || ""}
                            className="bg-primary/30 border-primary/30 dark:bg-accent text-accent-foreground"
                        />

                        <Input
                            disabled
                            value={user?.email || ""}
                            className="bg-primary/30 border-primary/30 dark:bg-accent text-accent-foreground"
                        />

                        <Input
                            {...form.register("phoneNumber")}
                            placeholder="Phone number"
                            className="bg-primary/30 border-primary/30 dark:bg-accent text-accent-foreground"
                        />

                        <Input
                            {...form.register("streetAddress")}
                            placeholder="Street address"
                            className="bg-primary/30 border-primary/30 dark:bg-accent text-accent-foreground"
                        />

                        <Input
                            {...form.register("postalCode")}
                            placeholder="Postal code"
                            className="bg-primary/30 border-primary/30 dark:bg-accent text-accent-foreground"
                        />

                        <Input
                            {...form.register("city")}
                            placeholder="City"
                            className="bg-primary/30 border-primary/30 dark:bg-accent text-accent-foreground"
                        />

                        <Button disabled={isPending}
                            className="py-5 hover:cursor-pointer text-lg text-accent">
                            Save changes
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
