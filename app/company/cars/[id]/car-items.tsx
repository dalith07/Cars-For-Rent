/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useCallback, useEffect, useState, } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { ImageIcon, Loader2, Minus, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { deleteImageCarItemById, updateCarItem } from "@/actions/dashboard/cars";
import { ItemsCarsWithAlll } from "@/lib/utils";
import { CompanyHeader } from "@/components/company/company-header";

interface carsItemsProps {
    carsItems: ItemsCarsWithAlll;
}
interface ImageFileAndProductnWithImagesProps {
    id?: string
    file?: File | null;  // <-- allow null
    preview: string;
    uploaded?: boolean;
    url?: string;
    uploadedData?: any;
}
interface Category {
    id: string;
    name: string;
}
interface Model {
    brand: string;
    icon?: string;
    models: {
        id: string;
        name: string;
    }[];
}

export default function CarItems({ carsItems }: carsItemsProps) {
    const router = useRouter();
    const [name, setName] = useState(carsItems.name ?? "");
    const [description, setDescription] = useState(carsItems.description ?? "");
    const [pricePerDay, setPricePerDay] = useState((carsItems.pricePerDay) || 0);
    const [year, setYear] = useState(carsItems.year ?? new Date().getFullYear());
    const [engine, setEngine] = useState(carsItems.engine ?? "");
    const [horsepower, setHorsepower] = useState<string>(carsItems.horsepower?.toString() ?? "");
    const [transmission, setTransmission] = useState(carsItems.transmission);
    const [stock, setStock] = useState(carsItems.stock?.toString() || "0");
    const [discount, setDiscount] = useState(carsItems.discount?.toString() || "0");
    const [status, setStatus] = useState(carsItems.status || "AVAILABLE");

    const [images, setImages] = useState<ImageFileAndProductnWithImagesProps[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [modelMenu, setModelMenu] = useState<Record<string, boolean>>({});

    const [selectedCategoryId, setSelectedCategoryId] = useState(carsItems.category?.name ?? "");
    const [selectedModelId, setSelectedModelId] = useState(carsItems.model?.name ?? "");

    const [deleting, setDeleting] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        imageId?: string;
        imageName?: string;
    }>({ open: false });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (deleteDialog.open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [deleteDialog.open]);

    useEffect(() => {
        setCategories([
            { id: "luxury", name: "Luxury Cars" },
            { id: "sport", name: "Sport Cars" },
            { id: "classic", name: "Classic Cars" },
            { id: "electric", name: "Electric Cars" },
        ]);
        setModels([
            {
                brand: "Tesla",
                icon: "/logos/logo-tesla.png",
                models: [
                    { id: "tesla_model_s", name: "Tesla Model S" },
                    // { id: "tesla_model_3", name: "Tesla Model 3" },
                    // { id: "tesla_model_x", name: "Tesla Model X" },
                    { id: "tesla_model_y", name: "Tesla Model Y" },
                ],
            },
            {
                brand: "Audi",
                icon: "/logos/logo-audi.png",
                models: [
                    { id: "audi_a4", name: "Audi A4" },
                    // { id: "audi_a6", name: "Audi A6" },
                    // { id: "audi_a8", name: "Audi A8" },
                    // { id: "audi_q5", name: "Audi Q5" },
                    { id: "audi_q7", name: "Audi Q7" },
                ]
            },
            {
                brand: "BMW",
                icon: "/logos/logo-bmw.png",
                models: [
                    // { id: "bmw_3series", name: "BMW 3 Series" },
                    // { id: "bmw_5series", name: "BMW 5 Series" },
                    // { id: "bmw_7series", name: "BMW 7 Series" },
                    // { id: "bmw_m3", name: "BMW M3" },
                    // { id: "bmw_m4", name: "BMW M4" },
                    // { id: "bmw_x5", name: "BMW X5" },
                    { id: "bmw_x6", name: "BMW X6" },

                    { id: "bmw_m5_competition", name: "BMW M5 Competition" },
                    { id: "bmw_m3_competition", name: "BMW M3 Competition" },
                    { id: "bmw_m5_e60", name: "BMW M5 E60" },
                    { id: "bmw_f30", name: "BMW F30 M Sport" },
                ]
            },
            {
                brand: "Mercedess",
                icon: "/logos/logo-mercedes.png",
                models: [
                    { id: "mercedes_g_class", name: "Mercedes G Class" },
                    { id: "mercedes_a_class", name: "Mercedes A Class" },
                ]
            },

            {
                brand: "Seat",
                icon: "/logos/logo-seat.png",
                models: [
                    { id: "seat", name: "Seat" },
                    { id: "seat_leion", name: "Seat Leion" },
                ]
            },

            {
                brand: "Golf",
                icon: "/logos/logo-golf.png",
                models: [
                    { id: "golf_7", name: "Golf 7" },
                    { id: "golf_7r", name: "Golf 7R" },
                    { id: "golf_8", name: "Golf 8" },
                ]
            },

            {
                brand: "Toyota",
                icon: "/logos/logo-toyota.png",
                models: [
                    { id: "toyota_corolla", name: "Toyota Corolla" },
                ]
            },
        ]);

        setLoading(false);
    }, []);

    const { startUpload, isUploading: uploadThingLoading } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            // setImages((prev) => {
            //     return prev.map((img) => {
            //         const uploadedFile = res.find((r) => r.name === img.file.name);
            //         return {
            //             ...img,
            //             uploaded: true,
            //             url: uploadedFile?.ufsUrl || uploadedFile?.url,
            //         };
            //     });
            // });

            setImages((prev) =>
                prev.map((img) => {
                    // Skip old images (already have a URL and no file)
                    if (!img.file) return img;

                    // Match only uploaded new files
                    const uploadedFile = res.find((r) => r.name === img.file?.name);

                    return {
                        ...img,
                        uploaded: true,
                        url: uploadedFile?.ufsUrl || uploadedFile?.url,
                    };
                })
            );

            toast.success("Image uploaded successfully");
            setUploadProgress(0);
            setIsUploading(false);
        },
        onUploadError: (error) => {
            toast.error(`Upload failed: ${error.message}`);
            setIsUploading(false);
            setUploadProgress(0);
        },
        onUploadProgress: (progress: number) => {
            setUploadProgress(progress);
        },
    });

    const totalImages = images.length;
    const remainingSlots = 4 - totalImages;

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            // const totalImages = carsItems.images.length + images.length;
            // const remainingSlots = 4 - totalImages;

            const totalImages = images.length; // ✅ FIX
            const remainingSlots = 4 - totalImages;

            if (remainingSlots <= 0) {
                toast.warning("Maximum 4 images allowed");
                return;
            }
            const filesToAdd = acceptedFiles.slice(0, remainingSlots);
            const newImages = filesToAdd.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                uploaded: false,
            }));

            setImages((prev) => [...prev, ...newImages]);

            if (acceptedFiles.length > remainingSlots) {
                alert(`Only ${remainingSlots} more images can be added. Maximum 4 images allowed.`);
            }

            setIsUploading(true);
            try {
                await startUpload(filesToAdd, {});
            } catch (error: any) {
                toast.error("Upload failed:", error)
            }
        },
        [images.length, startUpload, carsItems.images.length]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
        onDrop,
        accept: {
            // "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
            "image/*": [".jpeg", ".jpg", ".png",],
        },
        maxFiles: 4 - images.length,
        disabled: images.length >= 4 || isUploading,
        multiple: true,
    });

    const uploadImages = async () => {
        if (images.length === 0) return;

        const filesToUpload: File[] = images
            .filter((img): img is ImageFileAndProductnWithImagesProps & { file: File } => !!img.file && !img.uploaded)
            .map((img) => img.file);

        if (filesToUpload.length === 0) {
            toast.warning("All images are already uploaded!");
            return;
        }

        setIsUploading(true);
        try {
            await startUpload(filesToUpload, {});
        } catch (error: any) {
            toast.error("Upload failed: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const getDropzoneStyle = () => {
        const baseStyle = "border-2 border-slate-400 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer";

        if (images.length >= 4 || isUploading) {
            return `${baseStyle} border-muted-foreground/25 bg-muted/20 cursor-not-allowed opacity-50`;
        }

        if (isDragAccept) {
            return `${baseStyle} border-green-500 bg-green-50 border-solid`;
        }

        if (isDragReject) {
            return `${baseStyle} border-red-500 bg-red-50 border-solid`;
        }

        if (isDragActive) {
            return `${baseStyle} border-primary bg-primary/5 border-solid scale-105`;
        }

        return `${baseStyle} border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20`;
    };

    useEffect(() => {
        const oldImages = carsItems.images.map((img) => ({
            id: img.id,
            file: null,
            preview: img.imageUrl,
            uploaded: true,
            url: img.imageUrl,
        }));

        setImages(oldImages);
    }, []);

    const handleDeleteImage = async (imageId: string) => {
        try {
            setDeleting(true);

            const res = await deleteImageCarItemById(imageId);

            if (!res.success) {
                toast.error(res.message || "Failed deleting image");
                return;
            }

            setImages(prev => prev.filter(img => img.id !== imageId));

            toast.success("Image deleted");

        } catch (err) {
            toast.error("Delete failed");
        } finally {
            setDeleting(false);
            setDeleteDialog({ open: false });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !description.trim() || !pricePerDay || !selectedCategoryId) {
            toast.error("Please fill all required fields");
            return;
        }

        // Check if images are uploaded - check for url or uploadedData, not just uploaded flag
        const unuploadedImages = images.filter((img) => {
            const hasUrl = img.url || img.uploadedData?.ufsUrl || img.uploadedData?.url;
            return !img.uploaded && !hasUrl;
        });

        // console.log("unuploadedImages:✅✅", unuploadedImages);
        // console.log("All images state:", images.map(img => ({
        //     name: img.file.name,
        //     uploaded: img.uploaded,
        //     url: img.url,
        //     hasUploadedData: !!img.uploadedData
        // })));

        if (unuploadedImages.length > 0) {
            toast.error("Please upload all images before submitting");
            return;
        }
        try {
            setSubmitting(true);
            const result = await updateCarItem({
                id: carsItems.id,
                name: name,
                description: description,
                pricePerDay: pricePerDay,
                year: year,
                engine: engine,
                horsepower: horsepower,
                transmission: transmission,
                stock: stock,
                discount: discount,
                status: status,

                categoryId: selectedCategoryId,
                categoryName: selectedCategoryId,
                modelName: selectedModelId,
                modelId: selectedModelId,

                images: images
                    .map((img) => {
                        const imageUrl = img.url ||
                            img.uploadedData?.ufsUrl ||
                            img.uploadedData?.url;
                        return imageUrl ? { imageUrl } : null;
                    })
                    .filter((img): img is { imageUrl: string } => img !== null),
            });

            if (result.success) {
                toast.success("Car Is Updated successfully 🎉");
            } else {
                toast.error(result.message || "Failed to create car item");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while creating the car item");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-1 flex-col">
                <CompanyHeader title="Update Cars" description="Update your car details below." />
                <main className="flex flex-1 flex-col gap-6 p-6">
                    <Card className="bg-emerald-800">
                        {/* <CardHeader>
                            <CardTitle className="text-2xl text-slate-200">Update Car</CardTitle>
                            <CardDescription>Update your car details below.</CardDescription>
                        </CardHeader> */}

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title, Category, Model, Price */}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-slate-400">Car Name *</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g. Tesla Model S"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="bg-emerald-900 border-emerald-700 text-white placeholder:text-emerald-300/60"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sold" className="text-slate-400">Stock:</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            placeholder="0"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            className="bg-emerald-900 border-emerald-700 text-white placeholder:text-emerald-300/60"
                                        />
                                    </div>
                                </div >

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Category *</Label>
                                        <Select
                                            value={selectedCategoryId}
                                            onValueChange={setSelectedCategoryId}
                                        >
                                            <SelectTrigger className="w-full bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-emerald-900 border-emerald-700/70 text-white">
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* <div className="space-y-2">
                                        <Label>Model *</Label>

                                        <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                            <SelectTrigger className="w-full bg-emerald-900 border-emerald-700/70">
                                                <SelectValue placeholder="Select model" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[350px] overflow-y-auto bg-emerald-900 border-emerald-700/70 text-white">
                                                {models.map((group) => (
                                                    <SelectGroup key={group.brand}>
                                                        <SelectLabel
                                                            className="flex items-center justify-between px-2 py-2 cursor-pointer bg-emerald-900 rounded border-b pointer-events-auto"
                                                            onPointerDown={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setModelMenu((prev) => ({
                                                                    ...prev,
                                                                    [group.brand]: !prev[group.brand],
                                                                }));
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-3 font-semibold text-blue-600">
                                                                {group.brand}
                                                                <Image
                                                                    src={group.icon || "/logos/default.png"}
                                                                    alt={group.brand}
                                                                    width={20}
                                                                    height={20}
                                                                />
                                                            </div>
                                                            <span className="text-amber-900">
                                                                {modelMenu[group.brand] ? <Minus size={18} /> : <Plus size={18} />}
                                                            </span>
                                                        </SelectLabel>
                                                        {group.models.map((model) => (
                                                            <SelectItem
                                                                key={model.id}
                                                                value={model.id}
                                                                className={modelMenu[group.brand] ? "pl-6" : "pl-6 hidden"}
                                                            >
                                                                {model.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div> */}

                                    <div className="space-y-2">
                                        <Label className="text-gray-300">Model *</Label>

                                        <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                            <SelectTrigger className="w-full bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectValue placeholder="Select model" />
                                            </SelectTrigger>

                                            <SelectContent className="max-h-[350px] overflow-y-auto bg-emerald-900 border-emerald-700/70 text-white">
                                                {models.map((group) => (
                                                    <SelectGroup key={group.brand}>
                                                        {/* BRAND HEADER */}
                                                        <SelectLabel
                                                            className="
              flex items-center justify-between
              px-3 py-2
              bg-emerald-800
              text-slate-100
              font-semibold
              rounded-md
              border-b border-emerald-700
              cursor-pointer
              pointer-events-auto
            "
                                                            onPointerDown={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                setModelMenu((prev) => ({
                                                                    ...prev,
                                                                    [group.brand]: !prev[group.brand],
                                                                }))
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {group.brand}
                                                                <Image
                                                                    src={group.icon || "/logos/default.png"}
                                                                    alt={group.brand}
                                                                    width={20}
                                                                    height={20}
                                                                />
                                                            </div>

                                                            <button
                                                                type="button"
                                                                className="p-2 hover:cursor-pointer bg-emerald-950 rounded-lg text-white hover:bg-emerald-900"
                                                            >
                                                                {modelMenu[group.brand] ? (
                                                                    <Minus size={18} />
                                                                ) : (
                                                                    <Plus size={18} />
                                                                )}
                                                            </button>
                                                        </SelectLabel>

                                                        {/* MODELS */}
                                                        {group.models.map((model) => (
                                                            <SelectItem
                                                                key={model.id}
                                                                value={model.id}
                                                                className={`
                pl-8
                ${modelMenu[group.brand] ? "block" : "hidden"}
                focus:bg-emerald-700
                focus:text-white
              `}
                                                            >
                                                                {model.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="space-y-2 " >
                                            <Label htmlFor="status" className="text-slate-400">Status</Label>
                                            <Select
                                                value={status}
                                                onValueChange={(value) => setStatus(value as "AVAILABLE" | "RENTED" | "MAINTENANCE")}
                                            >
                                                <SelectTrigger className="w-full bg-emerald-900 border-emerald-700/70 text-white">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-emerald-900 border-emerald-700/70 text-white">
                                                    <SelectItem value="AVAILABLE">Available</SelectItem>
                                                    <SelectItem value="RENTED">Rented</SelectItem>
                                                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* 🧾 Price field with DT formatting */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Price (DT) *</Label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. 25.000.000 DT"
                                            value={
                                                pricePerDay
                                                    ? new Intl.NumberFormat("de-DE").format(Number(pricePerDay))
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/\D/g, ""); // only digits
                                                setPricePerDay(Number(raw)); // convert to number
                                            }}
                                            required
                                            className="bg-emerald-900 border-emerald-700 text-white placeholder:text-emerald-300/60"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sold" className="text-slate-400">discount % *</Label>
                                        <Input
                                            id="sold"
                                            type="number"
                                            placeholder="80% & 50%"
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            className="bg-emerald-900 border-emerald-700 text-white placeholder:text-emerald-300/60"
                                        />
                                    </div>

                                    {/* 📅 Year field (max 4 digits) */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Year</Label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 2022"
                                            value={year}
                                            onChange={(e) => {
                                                const val = e.target.value.slice(0, 4);
                                                setYear(val ? Number(val) : new Date().getFullYear());
                                            }}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                if (e.target.value.length > 4) {
                                                    e.target.value = e.target.value.slice(0, 4);
                                                }
                                            }}
                                            className="bg-emerald-900 border-emerald-700 text-white placeholder:text-emerald-300/60"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="engine" className="text-slate-400">Engine Type</Label>
                                        <Select
                                            value={engine}
                                            onValueChange={(value) => setEngine(value)}
                                        >
                                            <SelectTrigger className="w-full bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectValue placeholder="Select engine type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectItem value="V4">V4</SelectItem>
                                                <SelectItem value="V6">V6</SelectItem>
                                                <SelectItem value="V8">V8</SelectItem>
                                                <SelectItem value="V12">V12</SelectItem>
                                                <SelectItem value="Diesel">Diesel</SelectItem>
                                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                                <SelectItem value="Electric">Electric</SelectItem>
                                                <SelectItem value="Custom">Custom (enter manually)</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {engine === "Custom" && (
                                            <Input
                                                className="mt-2 bg-emerald-900 border-emerald-700 text-white placeholder:text-emerald-300/60"
                                                type="text"
                                                placeholder="Enter custom engine type"
                                                value={engine === "Custom" ? "" : engine}
                                                onChange={(e) => setEngine(e.target.value)}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="horsepower" className="text-slate-400">Horsepower (HP)</Label>
                                        <Select
                                            value={horsepower}
                                            onValueChange={(value) => setHorsepower(value)}
                                        >
                                            <SelectTrigger className="w-full bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectValue placeholder="Select horsepower range" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectItem value="100">Up to 100 HP</SelectItem>
                                                <SelectItem value="670">670 HP</SelectItem>
                                                <SelectItem value="1200">1200 HP</SelectItem>
                                                <SelectItem value="370">370 HP</SelectItem>
                                                <SelectItem value="500">500 HP</SelectItem>
                                                <SelectItem value="750">750 HP</SelectItem>
                                                <SelectItem value="950">950 HP</SelectItem>
                                                <SelectItem value="700-800">700–800 HP</SelectItem>
                                                <SelectItem value="Custom">Custom (enter manually)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {/* {horsepower === "Custom" && (
                                        <Input
                                            className="mt-2"
                                            type="number"
                                            placeholder="Enter custom horsepower"
                                            onChange={(e) => setHorsepower(e.target.value)}
                                        />
                                    )} */}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="transmission" className="text-slate-400">Transmission</Label>
                                        <Select value={transmission}
                                            onValueChange={(value) => setTransmission(value as "MANUAL" | "AUTOMATIC" | "SEMI_AUTOMATIC")}
                                        >
                                            <SelectTrigger className="w-full bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectValue placeholder="Select Transmission" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectItem value="MANUAL">Manual</SelectItem>
                                                <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                                                <SelectItem value="SEMI_AUTOMATIC">Semi-Auto</SelectItem>
                                            </SelectContent>
                                        </Select>

                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label className="text-slate-400">Description</Label>
                                    <Textarea
                                        placeholder="Enter car details..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="
    w-[80%]
    min-h-[120px]
    p-3
    rounded-lg
    bg-emerald-900
    border
    border-emerald-700
    text-white
    placeholder:text-emerald-300/60
    focus:border-emerald-500
    focus:ring-2
    focus:ring-emerald-600
    resize-none
  "                                    />
                                </div>

                                {/* Images */}
                                <div className="space-y-4">
                                    <Label className="text-slate-400">Production Images ({images.length}/4)</Label>

                                    {/* Dropzone Area */}
                                    <div {...getRootProps()} className={getDropzoneStyle()}>
                                        <input {...getInputProps()} />

                                        {images.length >= 4 ? (
                                            <>
                                                <ImageIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-muted-foreground">Maximum images reached</p>
                                                    <p className="text-xs text-muted-foreground">Remove an image to add more</p>
                                                </div>
                                            </>
                                        ) : isUploading ? (
                                            <>
                                                <Loader2 className="h-10 w-10 mx-auto mb-4 text-primary animate-spin" />
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Uploading images...</p>
                                                    <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                                                    <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                                                </div>
                                            </>
                                        ) : isDragActive ? (
                                            isDragAccept ? (
                                                <>
                                                    <Upload className="h-10 w-10 mx-auto mb-4 text-green-600" />
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium text-green-700">Drop the images here</p>
                                                        <p className="text-xs text-green-600">Release to upload your images</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <X className="h-10 w-10 mx-auto mb-4 text-red-600" />
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium text-red-700">Invalid file type</p>
                                                        <p className="text-xs text-red-600">Only image files are allowed</p>
                                                    </div>
                                                </>
                                            )
                                        ) : (
                                            <>
                                                <Upload className="h-10 w-10 mx-auto mb-4 text-slate-200" />
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-slate-100">Drag & drop images here, or click to select</p>
                                                    <p className="text-xs text-slate-300">
                                                        PNG, JPG, GIF up to 10MB each • Maximum {4 - images.length} more images
                                                    </p>
                                                </div>
                                                <Button type="button" variant="outline" className="mt-4 hover:text-white hover:bg-emerald-900 hover:cursor-pointer bg-emerald-950 text-white border-emerald-700">
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Choose Files
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    {/* Upload Button */}
                                    {images.length > 0 && images.some((img) => !img.uploaded) && (
                                        <div className="flex justify-center">
                                            <Button
                                                type="button"
                                                onClick={uploadImages}
                                                disabled={isUploading || uploadThingLoading}
                                                className="w-full max-w-xs"
                                            >
                                                {isUploading || uploadThingLoading ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Upload Images
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}

                                    {/* Image Preview Grid */}
                                    {carsItems?.images?.length > 0 && (
                                        <div className="space-y-2">
                                            <Label className="mb-4 text-slate-400">Product Images:</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {carsItems.images.map((image, index) => (
                                                    <div key={image.id} className="relative group">
                                                        <Image
                                                            src={image.imageUrl}
                                                            alt={`image Cars`}
                                                            width={300}
                                                            height={300}
                                                            className="w-full h-full object-cover rounded-lg border shadow-sm"
                                                        />

                                                        <Button
                                                            type="button"
                                                            onClick={() =>
                                                                setDeleteDialog({
                                                                    open: true,
                                                                    imageId: image.id,
                                                                    imageName: "Car image",
                                                                })
                                                            }
                                                            variant="destructive"
                                                            className="absolute z-50 -top-2 right-0 h-8 w-8 rounded-full hover:cursor-pointer animate-pulse"
                                                        >
                                                            <X />
                                                        </Button>

                                                        <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                                                            {index + 1}
                                                        </Badge>
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ✅ DELETE CONFIRM MODAL */}
                                {deleteDialog.open && (
                                    <div className="fixed inset-0 z-9999 flex items-center justify-center">
                                        {/* overlay */}
                                        <div
                                            className="absolute inset-0 h-screen bg-black/60 backdrop-blur-sm"
                                            onClick={() => setDeleteDialog({ open: false })}
                                        />

                                        {/* card */}
                                        <Card className="relative z-10 w-[350px] bg-emerald-950 border border-emerald-900 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
                                            <h2 className="text-lg font-semibold text-white mb-2">
                                                Delete image?
                                            </h2>

                                            <p className="text-sm text-emerald-200 mb-6">
                                                Are you sure you want to delete this image?
                                                This action cannot be undone.
                                            </p>

                                            <div className="flex justify-end gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setDeleteDialog({ open: false })}
                                                    className="hover:bg-emerald-800"
                                                >
                                                    Cancel
                                                </Button>

                                                <Button
                                                    variant="destructive"
                                                    onClick={() => handleDeleteImage(deleteDialog.imageId!)}
                                                    disabled={deleting}
                                                    className="hover:cursor-pointer"
                                                >
                                                    {deleting ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        "Yes, delete"
                                                    )}
                                                </Button>
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex justify-between pt-6">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/dashboard/cars">Cancel</Link>
                                    </Button>

                                    <Button type="submit"
                                        disabled={isUploading || uploadThingLoading}
                                        className="hover:cursor-pointer text-white"
                                    >
                                        Update Itesm Car
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </main >
            </div>
        </ >
    );
}


