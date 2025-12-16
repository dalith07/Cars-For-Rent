"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import gsap from "gsap";
import Image from "next/image";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileImage } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema } from "@/lib/validationSchema";
import { useForm } from "react-hook-form";
import { useUploadThing } from "@/lib/uploadthing";
import { createOrUpdateProfile } from "@/actions/profile";
import { getUserProfile } from "@/actions/dashboard/users";

export default function ProfilePage() {
    const containerRef = useRef<HTMLDivElement>(null);

    const user = useCurrentUser();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [imageUploadUrl, setImageUploadUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);

    const [phone, setPhone] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [city, setCity] = useState("");

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    // const form = useForm<z.infer<typeof ProfileSchema>>({
    //     resolver: zodResolver(ProfileSchema),
    // });

    useEffect(() => {
        if (!user?.id) return;

        const loadProfile = async () => {
            const profile = await getUserProfile(user.id);

            if (profile) {
                // eslint-disable-next-line react-hooks/immutability
                form.reset({
                    phoneNumber: profile.phoneNumber || "",
                    streetAddress: profile.streetAddress || "",
                    postalCode: profile.postalCode || "",
                    city: profile.city || "",
                });
            }
        };

        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id,]);

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            phoneNumber: phone,
            streetAddress: streetAddress,
            postalCode: postalCode,
            city: city,
        },
    });

    useEffect(() => {
        if (!user) return;

        setTimeout(() => {
            setUserName(user.name || "");
            setEmail(user.email || "");
            setImageUploadUrl(user.image || null);
        }, 0);
    }, [user]);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(".anim-item", {
                opacity: 0,
                y: 40,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: async ([data]) => {
            setImageUploadUrl(data.ufsUrl);
            toast.success("Image uploaded successfully!");
            setUploadProgress(0);
        },
        onUploadProgress(progress) {
            setUploadProgress(progress);
        },
    });

    const onDropAccepted = (files: File[]) => {
        setUploadProgress(1);
        startUpload(files, {});
    };

    const onDropRejected = () => toast.error("Invalid file format");

    const handelOnSubmit = (values: z.infer<typeof ProfileSchema>) => {
        setError("");
        setSuccess("");

        if (!user?.id) {
            setError("User not found.");
            return;
        }
        startTransition(() => {
            createOrUpdateProfile(values, user.id).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            });
        });
    };


    return (
        <div
            ref={containerRef}
            className="min-h-screen mt-32 flex items-center justify-center m-4 md:m-0"
        >
            <div className="anim-item w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-3xl border border-white/20 shadow-[0_0_35px_rgba(0,0,0,0.45)] p-10">
                <h1 className="text-4xl font-semibold text-center text-white mb-10 tracking-wide">
                    User Profile
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Avatar + Upload */}
                    <div className="flex flex-col items-center gap-5">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                            <Image
                                src={imageUploadUrl || "/logo-mini.png"}
                                width={200}
                                height={200}
                                alt="Profile"
                                className="object-cover"
                            />
                        </div>

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
                                    className={`border-2 border-dashed rounded-xl p-4 w-56 text-center cursor-pointer transition 
                  ${isDragOver ? "border-blue-400 bg-blue-900/20" : "border-gray-500/60 text-gray-300"}`}
                                >
                                    <input {...getInputProps()} />
                                    {uploadProgress > 0 ? (
                                        <Progress value={uploadProgress} className="w-full h-2" />
                                    ) : (
                                        <span className="flex items-center gap-2 justify-center font-medium">
                                            <FileImage className="w-5 h-5" /> Upload Image
                                        </span>
                                    )}
                                </div>
                            )}
                        </Dropzone>
                    </div>

                    {/* Form */}
                    <div className="flex flex-col gap-3">
                        <form onSubmit={form.handleSubmit(handelOnSubmit)} className="flex flex-col space-y-4">
                            <Input
                                className="bg-white/10 border-white/20 text-white"
                                placeholder="Full name"
                                value={userName}
                                disabled
                                onChange={(e) => setUserName(e.target.value)}
                            />

                            <Input
                                className="bg-white/10 border-white/20 text-white"
                                placeholder="Email"
                                type="email"
                                value={email}
                                disabled
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Input
                                {...form.register("phoneNumber")}
                                className="bg-white/10 border-white/20 text-white"
                                placeholder="Phone number"
                            />

                            <Input
                                {...form.register("streetAddress")}
                                className="bg-white/10 border-white/20 text-white"
                                placeholder="Street address"
                            />

                            <Input
                                {...form.register("postalCode")}
                                className="bg-white/10 border-white/20 text-white"
                                placeholder="Postal Code"
                            />

                            <Input
                                {...form.register("city")}
                                className="bg-white/10 border-white/20 text-white"
                                placeholder="City"
                            />

                            <Button
                                type="submit"
                                className="bg-blue-600 hover:cursor-pointer text-white hover:bg-blue-500 w-full py-6 rounded-xl text-lg font-semibold"
                                disabled={isPending}
                            >
                                Save Changes
                            </Button>
                        </form>

                        {error && <p className="text-red-500 bg-red-500/30 p-2 rounded-lg text-sm">{error}</p>}
                        {success && <p className="text-green-500 bg-green-500/30 p-2 rounded-lg text-sm">{success}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
