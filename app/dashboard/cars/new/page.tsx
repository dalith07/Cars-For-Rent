/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback, useRef } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
    Upload,
    X,
    Loader2,
    Plus,
    Minus,
    CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "react-dropzone";

import { createCarItem } from "@/actions/dashboard/cars";
import { Badge } from "@/components/ui/badge";

interface ImageFile {
    file: File;
    preview: string;
    uploaded?: boolean;
    url?: string;
    uploadedData?: any;
}

interface Category {
    id: string;
    name: string;
}

type Model = {
    brand: string;
    icon?: string;
    models: {
        id: string;
        name: string;
    }[];
};

const CreateCars = () => {
    const router = useRouter();
    const formRef = useRef<HTMLDivElement>(null);
    // 🔹 Form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [year, setYear] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedModelId, setSelectedModelId] = useState("");
    const [engine, setEngine] = useState("");
    const [horsepower, setHorsepower] = useState<string>("");
    const [transmission, setTransmission] = useState("");
    const [discount, setDiscount] = useState("");
    const [status, setStatus] = useState("available");
    const [version, setVersion] = useState("");
    const [quantity, setQuantity] = useState("");

    const [images, setImages] = useState<ImageFile[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [modelMenu, setModelMenu] = useState<Record<string, boolean>>({});

    // 🌀 Animate in form when loaded
    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(
                formRef.current.children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                }
            );
        }
    }, [loading]);

    // Fetch categories (replace with real API later)
    useEffect(() => {
        const timer = setTimeout(() => {
            setCategories([
                { id: "luxury", name: "Luxury Cars" },
                { id: "sport", name: "Sport Cars" },
                { id: "classic", name: "Classic Cars" },
                { id: "electric", name: "Electric Cars" },
            ]);

            setModels([
                {
                    brand: "Tesla",
                    icon: "/logos/logo-mercedes.png",
                    models: [
                        { id: "tesla_model_s", name: "Tesla Model S" },
                        { id: "tesla_model_3", name: "Tesla Model 3" },
                        { id: "tesla_model_x", name: "Tesla Model X" },
                        { id: "tesla_model_y", name: "Tesla Model Y" },
                    ],
                },
                {
                    brand: "Audi",
                    icon: "/logos/logo-audi.png",
                    models: [
                        { id: "audi_a4", name: "Audi A4" },
                        { id: "audi_a6", name: "Audi A6" },
                        { id: "audi_a8", name: "Audi A8" },
                        { id: "audi_q5", name: "Audi Q5" },
                        { id: "audi_q7", name: "Audi Q7" },
                    ]
                },
                {
                    brand: "BMW",
                    icon: "/logos/logo-bmw.png",
                    models: [
                        { id: "bmw_3series", name: "BMW 3 Series" },
                        { id: "bmw_5series", name: "BMW 5 Series" },
                        { id: "bmw_7series", name: "BMW 7 Series" },
                        { id: "bmw_m3", name: "BMW M3" },
                        { id: "bmw_m4", name: "BMW M4" },
                        { id: "bmw_x5", name: "BMW X5" },
                        { id: "bmw_x6", name: "BMW X6" },
                        { id: "bmw_m5_competition", name: "BMW M5 Competition" },
                        { id: "bmw_f30", name: "BMW F30 M Sport" },
                    ]
                },
            ]);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const { startUpload } = useUploadThing("imageUploader", {

        onClientUploadComplete: (res) => {
            console.log("✅ Upload complete, received files:", res);

            setImages((prev) => {
                // Find unuploaded images (those without url or uploaded flag)
                const unuploadedIndices: number[] = [];
                prev.forEach((img, idx) => {
                    if (!img.uploaded && !img.url) {
                        unuploadedIndices.push(idx);
                    }
                });

                // Match uploaded files to unuploaded images by order
                // UploadThing returns files in the same order they were uploaded
                return prev.map((img, idx) => {
                    // If already uploaded, keep as is
                    if (img.uploaded || img.url) {
                        return img;
                    }

                    // Find this image's position in the unuploaded list
                    const unuploadedIndex = unuploadedIndices.indexOf(idx);

                    // If this image was just uploaded, match it with the response
                    if (unuploadedIndex !== -1 && unuploadedIndex < res.length) {
                        const uploadedFile = res[unuploadedIndex];
                        const fileUrl = uploadedFile?.ufsUrl || uploadedFile?.url;

                        if (fileUrl) {
                            console.log(`✅ Matched image ${idx} with URL:`, fileUrl);
                            return {
                                ...img,
                                uploaded: true,
                                url: fileUrl,
                                uploadedData: uploadedFile,
                            };
                        }
                    }

                    // Try fallback matching by name and size
                    const uploadedFile = res.find(
                        (r) => r.name === img.file.name && r.size === img.file.size
                    );

                    if (uploadedFile) {
                        const fileUrl = uploadedFile.ufsUrl || uploadedFile.url;
                        console.log(`✅ Matched image ${idx} by name/size with URL:`, fileUrl);
                        return {
                            ...img,
                            uploaded: true,
                            url: fileUrl,
                            uploadedData: uploadedFile,
                        };
                    }

                    return img;
                });
            });

            toast.success("Images uploaded successfully");
            setUploadProgress(0);
            setUploading(false);
        },

        onUploadError: (error) => {
            console.error("❌ Upload error:", error);
            let errorMessage = "Upload failed. Please try again.";
            if (error.message.includes("File too large")) errorMessage = "File too large. Max 8MB.";
            if (error.message.includes("Invalid file type")) errorMessage = "Invalid file type. Use images only.";
            toast.error(errorMessage);
            setUploadProgress(0);
            setUploading(false);
        },
        onUploadProgress: (progress) => setUploadProgress(progress),
    });

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const remainingSlots = 4 - images.length;
            if (remainingSlots <= 0) {
                toast.error("Maximum 4 images allowed");
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
                toast.warning(`Only ${remainingSlots} more images can be added.`);
            }

            setUploadProgress(0);
            setUploading(true);
            try {
                await startUpload(filesToAdd, {}); // Added empty object as second argument
            } finally {
                setUploading(false);
            }
        },
        [images.length, startUpload],
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
        onDrop,
        // accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
        accept: { "image/*": [".jpeg", ".jpg", ".png"] },
        maxFiles: 4 - images.length,
        disabled: images.length >= 4,
        multiple: true,
        maxSize: 8 * 1024 * 1024, // 8MB
    });

    const removeImage = (index: number) => {
        setImages((prev) => {
            const newImages = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index].preview);
            return newImages;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.log("first click button cars✅")
        if (!name.trim() || !description.trim() || !price.trim() || !selectedCategoryId) {
            toast.error("Please fill all required fields");
            return;
        }

        if (images.length === 0) {
            toast.error("Please add at least one image");
            return;
        }

        // Check if images are uploaded - check for url or uploadedData, not just uploaded flag
        const unuploadedImages = images.filter((img) => {
            const hasUrl = img.url || img.uploadedData?.ufsUrl || img.uploadedData?.url;
            return !img.uploaded && !hasUrl;
        });

        console.log("unuploadedImages:✅✅", unuploadedImages);
        console.log("All images state:", images.map(img => ({
            name: img.file.name,
            uploaded: img.uploaded,
            url: img.url,
            hasUploadedData: !!img.uploadedData
        })));

        if (unuploadedImages.length > 0) {
            toast.error("Please upload all images before submitting");
            return;
        }
        console.log("first click button carsssss✅✅")
        try {
            setSubmitting(true);
            const result = await createCarItem({
                name: name,
                description: description,
                price: parseFloat(price),
                year: year ? parseInt(year) : 2025,
                engine: engine,
                horsepower: horsepower,
                transmission: transmission,
                quantity: quantity,
                discount: discount,
                status: status,
                version: version,

                categoryId: selectedCategoryId,
                categoryName: selectedCategoryId,
                modelName: selectedModelId,
                modelId: selectedModelId,

                imagesOnCars: images
                    .map((img) => {
                        // Try multiple sources for the image URL
                        const imageUrl = img.url ||
                            img.uploadedData?.ufsUrl ||
                            img.uploadedData?.url;
                        return imageUrl ? { imageUrl } : null;
                    })
                    .filter((img): img is { imageUrl: string } => img !== null),
            });

            if (result.success) {
                toast.success("Car item created successfully 🎉");
                setName("");
                setDescription("");
                setPrice("");
                setYear("");
                setEngine("");
                setHorsepower("");
                setTransmission("");
                setQuantity("");
                setDiscount("");
                setStatus("available");
                setVersion("");
                setSelectedCategoryId("");
                setSelectedModelId("");
                setImages([]);
                // router.push("/dashboard/items_cars");
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

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );

    return (
        <>
            <div ref={formRef} className="flex-1">
                <Card className="p-4">
                    <CardHeader>
                        <CardTitle>Create Car Item</CardTitle>
                        <CardDescription>Fill in details for your new car item.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Car Name *</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Tesla Model S"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="engine">Version Type</Label>
                                    <Select
                                        value={version}
                                        onValueChange={(value) => setVersion(value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select engine type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="occasion">Occasion</SelectItem>
                                            {/* <SelectItem value="custom">Custom (enter manually)</SelectItem> */}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sold">quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="0"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Category *</Label>
                                    <Select
                                        value={selectedCategoryId}
                                        onValueChange={setSelectedCategoryId}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Model *</Label>

                                    <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select model" />
                                        </SelectTrigger>

                                        <SelectContent className="max-h-[350px] overflow-y-auto">
                                            {models.map((group) => (
                                                <div key={group.brand} className="border-b pb-1">

                                                    {/* HEADER ROW (NOT SelectLabel) */}
                                                    <div
                                                        className="flex items-center justify-between px-2 py-2 cursor-pointer bg-gray-50 rounded"
                                                        onClick={(e) => {
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

                                                        <button type="button" className="text-amber-900">
                                                            {modelMenu[group.brand] ? <Minus size={18} /> : <Plus size={18} />}
                                                        </button>
                                                    </div>

                                                    {/* CHILD MODELS */}
                                                    {modelMenu[group.brand] &&
                                                        group.models.map((model) => (
                                                            <SelectItem
                                                                key={model.id}
                                                                value={model.id}
                                                                className="pl-6"
                                                            >
                                                                {model.name}
                                                            </SelectItem>
                                                        ))}
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="space-y-2 " >
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={status} onValueChange={setStatus} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            {/* <SelectContent > */}
                                            <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                                                <SelectItem value="available">Available</SelectItem>
                                                <SelectItem value="rented">Rented</SelectItem>
                                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* 🧾 Price field with DT formatting */}
                                <div className="space-y-2">
                                    <Label>Price (DT) *</Label>
                                    <Input
                                        type="text"
                                        placeholder="e.g. 25.000.000 DT"
                                        value={
                                            price
                                                ? new Intl.NumberFormat("de-DE").format(Number(price))
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, ""); // remove all non-numeric chars
                                            setPrice(raw);
                                        }}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sold">discount % *</Label>
                                    <Input
                                        id="sold"
                                        type="number"
                                        placeholder="80% & 50%"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        className="w-"
                                    />
                                </div>

                                {/* 📅 Year field (max 4 digits) */}
                                <div className="space-y-2">
                                    <Label>Year</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 2022"
                                        value={year}
                                        onChange={(e) => {
                                            const val = e.target.value.slice(0, 4); // limit to 4 digits
                                            setYear(val);
                                        }}
                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.value.length > 4) {
                                                e.target.value = e.target.value.slice(0, 4);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* 🧩 Engine, Horsepower, Transmission */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="engine">Engine Type</Label>
                                    <Select
                                        value={engine}
                                        onValueChange={(value) => setEngine(value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select engine type" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                            className="mt-2"
                                            type="text"
                                            placeholder="Enter custom engine type"
                                            value={engine === "Custom" ? "" : engine}
                                            onChange={(e) => setEngine(e.target.value)}
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="horsepower">Horsepower (HP)</Label>
                                    <Select
                                        value={horsepower}
                                        onValueChange={(value) => setHorsepower(value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select horsepower range" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                    {horsepower === "Custom" && (
                                        <Input
                                            className="mt-2"
                                            type="number"
                                            placeholder="Enter custom horsepower"
                                            onChange={(e) => setHorsepower(e.target.value)}
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="transmission">Transmission</Label>
                                    <Select
                                        value={transmission}
                                        onValueChange={(value) => setTransmission(value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Transmission" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="auto">Auto</SelectItem>
                                            <SelectItem value="manuille">Manuille</SelectItem>
                                            <SelectItem value="Custom">Custom (enter manually)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {transmission === "Custom" && (
                                        <Input
                                            className="mt-2"
                                            type="text"
                                            placeholder="Enter Transmission"
                                            onChange={(e) => setTransmission(e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Enter car details..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-[80%] p-3 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            {/* Images Dropzone */}
                            <div className="space-y-2">
                                <Label>Car Images ({images.length}/4)</Label>
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}`}
                                >
                                    <input {...getInputProps()} />
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
                                            <Progress
                                                value={uploadProgress}
                                                className="w-full max-w-xs mx-auto mt-2"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {uploadProgress}% uploaded
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm font-medium">Drag & drop or click to select</p>
                                            <p className="text-xs text-muted-foreground">
                                                PNG, JPG up to 8MB • Max {4 - images.length} more
                                            </p>
                                        </>
                                    )}
                                </div>

                                {images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {images.map((image, i) => (
                                            <div key={i} className="relative group">
                                                <Image
                                                    src={image.url || image.preview}
                                                    alt={`Car image ${i + 1}`}
                                                    width={150}
                                                    height={150}
                                                    className="w-full h-32 object-cover rounded-md border"
                                                />
                                                {/* Upload success indicator */}
                                                {(image.uploaded || image.url) && (
                                                    <div className="absolute top-1 left-1 bg-green-500 rounded-full p-1">
                                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                                    </div>
                                                )}
                                                {/* Remove button */}
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition"
                                                    onClick={() => removeImage(i)}
                                                    disabled={uploading}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4 pt-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        type="submit"
                                        className="flex-1 text-white hover:cursor-pointer group"
                                    // disabled={images.some((img) => !img.uploaded)}
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Uploading Images... ({uploadProgress}%)
                                            </>
                                        ) : submitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Creating Car Item...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2 group-hover:animate-ping" />
                                                Create Car Item
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        disabled={submitting}
                                        asChild
                                    >
                                        <Link href="/dashboard/cars">Cancel</Link>
                                    </Button>
                                </div>

                                {/* Helper message when button is disabled */}
                                {(uploading || (images.length > 0 && images.some((img) => {
                                    const hasUrl = img.url || img.uploadedData?.ufsUrl || img.uploadedData?.url;
                                    return !img.uploaded && !hasUrl;
                                })) || !name.trim() || !price.trim() || !selectedCategoryId || !selectedModelId) && !submitting && (
                                        <p className="text-sm text-muted-foreground text-center ">
                                            {uploading ? (
                                                <span>Please wait while images are uploading...</span>
                                            ) : images.length > 0 && images.some((img) => {
                                                const hasUrl = img.url || img.uploadedData?.ufsUrl || img.uploadedData?.url;
                                                return !img.uploaded && !hasUrl;
                                            }) ? (
                                                <span>Please wait for all images to finish uploading before creating the car item.</span>
                                            ) : !name.trim() || !price.trim() || !selectedCategoryId || !selectedModelId ? (
                                                <span>Please fill in all required fields (marked with *) to create the car item.</span>
                                            ) : null}
                                        </p>
                                    )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {(name || description || price || selectedCategoryId || selectedModelId) && (
                    <Card className="mt-4 bg-yellow-50">
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>This is how your products item will appear</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {name && <h3 className="text-xl font-semibold">{name}</h3>}
                                {description && <p className="text-muted-foreground">{description}</p>}
                                <div className="flex flex-wrap gap-2">
                                    {selectedCategoryId && (
                                        <Badge variant="secondary">Category: {categories.find((c) => c.id === selectedCategoryId)?.name}</Badge>
                                    )}
                                    {selectedModelId && (
                                        <Badge variant="outline">Model: {models.find((m) => m.brand === selectedModelId)?.brand}</Badge>
                                    )}
                                    {price && <Badge variant="outline">Price: ${price}</Badge>}
                                    {discount && <Badge variant="outline">Discount: {discount}%</Badge>}
                                    {quantity && <Badge variant="outline">Quantity: {quantity}</Badge>}
                                    <Badge
                                        className={
                                            status === "available"
                                                ? "bg-green-100 text-green-800"
                                                : status === "rented"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                        }
                                    >
                                        {status}
                                    </Badge>
                                    {images.length > 0 && (
                                        <Badge variant="outline">{images.length} image{images.length !== 1 ? "s" : ""}</Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    )
}

export default CreateCars
