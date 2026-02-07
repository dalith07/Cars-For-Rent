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
    SelectGroup,
    SelectItem,
    SelectLabel,
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
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "react-dropzone";

import { createCarItem } from "@/actions/dashboard/cars";
import { Badge } from "@/components/ui/badge";
import { CompanyHeader } from "@/components/company/company-header";


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
    const [pricePerDay, setPricePerDay] = useState("");
    const [year, setYear] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedModelId, setSelectedModelId] = useState("");
    const [engine, setEngine] = useState("");
    const [horsepower, setHorsepower] = useState<string>("");
    const [transmission, setTransmission] = useState("");
    const [discount, setDiscount] = useState("");
    const [status, setStatus] = useState("AVAILABLE");
    // const [version, setVersion] = useState("");
    const [stock, setStock] = useState("");

    const [images, setImages] = useState<ImageFile[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

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
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            // console.log("Uploaded images👍👍👍👍:", res.map((r) => r.url));

            // ⭐ PRINT URL ONE BY ONE
            res.forEach((file) => {
                // console.log("IMAGE URL:", file.url);
            });

            if (!res) return;
            setImages((prev) =>
                prev.map((img) => {
                    const uploadedFile = res.find(
                        (r) => r.name === img.file.name && r.size === img.file.size
                    );
                    return uploadedFile
                        ? {
                            ...img,
                            uploaded: true,
                            url: uploadedFile.ufsUrl || uploadedFile.url,
                            uploadedData: uploadedFile,
                        }
                        : img;
                })
            );
            toast.success("Images uploaded successfully");
            // console.log("👍👍");

            setUploadProgress(0);
            setUploading(false);
            // console.log("👍👍👍👍");

        },
        // onClientUploadComplete: (res) => {
        //     console.log("Uploaded images👍👍👍👍:", res.map((r) => r.url));
        //     setImages((prev) =>
        //         prev.map((img, index) => ({
        //             ...img,
        //             uploaded: true,
        //             url: res[index]?.url,
        //             uploadedData: res[index],
        //         }))
        //     );

        //     toast.success("Images uploaded successfully");
        //     setUploading(false);
        //     setUploadProgress(0);
        // },
        onUploadError: (error) => {
            toast.error(
                error.message.includes("File too large")
                    ? "File too large (max 10MB)"
                    : "Upload failed. Please try again."
            );
            setUploading(false);
            setUploadProgress(0);
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
            setUploading(true);
            await startUpload(filesToAdd, {});
        },
        [images.length, startUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpeg", ".jpg", ".png"] },
        maxFiles: 4 - images.length,
        multiple: true,
        maxSize: 10 * 1024 * 1024,
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

        if (!name.trim() || !pricePerDay.trim() || !selectedCategoryId || !selectedModelId) {
            toast.error("Please fill all required fields");
            return;
        }

        const unuploadedImages = images.filter((img) => !img.uploaded);
        if (unuploadedImages.length > 0) {
            toast.error("Please wait for all images to finish uploading");
            return;
        }

        try {
            const result = await createCarItem({
                name: name,
                description: description,
                pricePerDay: parseFloat(pricePerDay),
                year: year ? parseInt(year) : 2025,
                engine: engine,
                horsepower: horsepower,
                transmission: transmission,
                stock: stock,
                discount: discount,
                status: status,
                categoryName: selectedCategoryId,
                modelName: selectedModelId,
                modelId: selectedModelId,

                images: images.map((img) => ({
                    imageUrl: img.uploadedData?.url
                })),
            });

            if (result.success) {
                toast.success("Car item created successfully 🎉");
                // router.push("/dashboard/cars");
            } else {
                toast.error(result.message || "Failed to create car item");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while creating the car item");
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
                <CompanyHeader title="Create Car" description="Fill in details for your new car item." />

                <main className="flex flex-1 flex-col gap-6 p-6">
                    <Card className="bg-emerald-800 border-emerald-700">
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-gray-300">Car Name</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g. Tesla Model S"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="bg-emerald-900 border-emerald-800 text-white placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sold" className="text-gray-300">Stock</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            placeholder="0"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            className="bg-emerald-900 border-emerald-800 text-white placeholder:text-slate-400"
                                        />
                                    </div>
                                </div >

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">Category</Label>
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

                                    <div className="space-y-2">
                                        <Label className="text-gray-300">Model</Label>

                                        <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                                            <SelectTrigger className="w-full bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectValue placeholder="Select model" />
                                            </SelectTrigger>

                                            <SelectContent className="bg-emerald-900 border-emerald-700/70 text-white">
                                                {models.map((group, i) => (
                                                    <SelectGroup key={i}>
                                                        <SelectLabel className="flex items-center justify-between bg-emerald-800">
                                                            <div className="flex items-center text-slate-100 font-extrabold gap-4">
                                                                {group.brand}
                                                                <Image
                                                                    src={group.icon || "/logos/default.png"}
                                                                    alt={`${group.brand} logo`}
                                                                    width={20}
                                                                    height={20}
                                                                />
                                                            </div>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();      // ⬅ FIX: prevent select from closing
                                                                    e.stopPropagation();     // ⬅ keep dropdown open
                                                                    setModelMenu((prev) => ({
                                                                        ...prev,
                                                                        [group.brand]: !prev[group.brand],
                                                                    }));
                                                                }}
                                                                type="button"
                                                                className="p-2 hover:cursor-pointer bg-emerald-950 rounded-lg text-white"
                                                            >
                                                                {modelMenu[group.brand] ? <Minus size={20} /> : <Plus size={20} />}
                                                            </button>

                                                        </SelectLabel>

                                                        {modelMenu[group.brand] &&
                                                            group.models.map((model) => (
                                                                <SelectItem key={model.id} value={model.id}>
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
                                            <Label htmlFor="status" className="text-gray-300">Status</Label>
                                            <Select value={status} onValueChange={setStatus} >
                                                <SelectTrigger className="w-full bg-emerald-900 border-emerald-700/70 text-white">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent
                                                    className="bg-emerald-900 border-emerald-700/70 text-white"
                                                >
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
                                        <Label className="text-gray-300">Price (DT)</Label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. 25.000.000 DT"
                                            value={
                                                pricePerDay
                                                    ? new Intl.NumberFormat("de-DE").format(Number(pricePerDay))
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/\D/g, ""); // remove all non-numeric chars
                                                setPricePerDay(raw);
                                            }}
                                            required
                                            className="bg-emerald-900 border-emerald-800 text-white placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sold" className="text-gray-300">discount %</Label>
                                        <Input
                                            id="sold"
                                            type="number"
                                            placeholder="80% & 50%"
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            className="bg-emerald-900 border-emerald-800 text-white placeholder:text-slate-400"
                                        />
                                    </div>

                                    {/* 📅 Year field (max 4 digits) */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">Year</Label>
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
                                            className="bg-emerald-900 border-emerald-800 text-white placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* 🧩 Engine, Horsepower, Transmission */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="engine" className="text-gray-300">Engine Type</Label>
                                        <Select
                                            value={engine}
                                            onValueChange={(value) => setEngine(value)}
                                        >
                                            <SelectTrigger className="w-full bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectValue placeholder="Select engine type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-emerald-900 border-emerald-700/70 text-white"
                                            >
                                                <SelectItem value="V4">V4</SelectItem>
                                                <SelectItem value="V6">V6</SelectItem>
                                                <SelectItem value="V8">V8</SelectItem>
                                                <SelectItem value="V12">V12</SelectItem>
                                                <SelectItem value="Diesel">Diesel</SelectItem>
                                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                                <SelectItem value="Electric">Electric</SelectItem>
                                                {/* <SelectItem value="Custom">Custom (enter manually)</SelectItem> */}
                                            </SelectContent>
                                        </Select>

                                        {engine === "Custom" && (
                                            <Input
                                                type="text"
                                                placeholder="Enter custom engine type"
                                                value={engine === "Custom" ? "" : engine}
                                                onChange={(e) => setEngine(e.target.value)}
                                                className="mt-2 bg-emerald-900 border-emerald-800 text-white placeholder:text-slate-400"
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="horsepower" className="text-gray-300">Horsepower (HP)</Label>
                                        <Select
                                            value={horsepower}
                                            onValueChange={(value) => setHorsepower(value)}
                                        >
                                            <SelectTrigger className="w-full bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectValue placeholder="Select horsepower range" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-emerald-900 border-emerald-700/70 text-white">                                                <SelectItem value="100">Up to 100 HP</SelectItem>
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
                                                className="mt-2 bg-emerald-900 border-emerald-800 text-white placeholder:text-slate-400"
                                                type="number"
                                                placeholder="Enter custom horsepower"
                                                onChange={(e) => setHorsepower(e.target.value)}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="transmission" className="text-gray-300">
                                            Transmission
                                        </Label>

                                        <Select
                                            value={transmission}
                                            onValueChange={(value) => setTransmission(value)}
                                        >
                                            <SelectTrigger className="w-full bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectValue placeholder="Select Transmission" />
                                            </SelectTrigger>

                                            <SelectContent className="bg-emerald-900 border-emerald-700/70 text-white">
                                                <SelectItem value="MANUAL">Manual</SelectItem>
                                                <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                                                <SelectItem value="SEMI_AUTOMATIC">Semi-Automatic</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-300">Description</Label>
                                    <Textarea
                                        placeholder="Enter car details..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-[80%] min-h-[100px] p-3 rounded-lg focus:ring-2 bg-emerald-900 border-emerald-800 text-white placeholder:text-slate-400 resize-none"
                                    />
                                </div>

                                {/* Images Dropzone */}
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Car Images ({images.length}/4)</Label>
                                    <div
                                        {...getRootProps()}
                                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${isDragActive ? "border-emerald-700 bg-primary/10" : "border-emerald-600"}`}
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
                                                <Upload className="w-10 h-10 mx-auto mb-2 text-slate-100" />
                                                <p className="text-sm font-medium text-slate-300">Drag & drop or click to select</p>
                                                <p className="text-xs text-muted-foreground">
                                                    PNG, JPG up to 10MB • Max {4 - images.length} more
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {images.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            {images.map((image, i) => (
                                                <div key={i} className="relative group">
                                                    <Image
                                                        src={image.preview}
                                                        alt={`Car image ${i + 1}`}
                                                        width={150}
                                                        height={150}
                                                        className="w-full h-32 object-cover rounded-md border border-emerald-700"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition"
                                                        onClick={() => removeImage(i)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                    <Button
                                        type="submit"
                                        className="flex-1 text-white hover:cursor-pointer group"
                                        disabled={images.some((img) => !img.uploaded)}
                                    >
                                        <Plus className="h-4 w-4 mr-2 group-hover:animate-ping" />
                                        Create Car Item
                                    </Button>

                                    <Button type="button" variant="outline" className="flex-1" asChild>
                                        <Link href="/dashboard/cars">Cancel</Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {(name || description || pricePerDay || selectedCategoryId || selectedModelId) && (
                        <Card className="mt-4 bg-emerald-800">
                            <CardHeader>
                                <CardTitle className="text-slate-100">Preview</CardTitle>
                                <CardDescription className="text-slate-300">This is how your products item will appear</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {name && <h3 className="text-xl font-semibold text-white">{name}</h3>}
                                    {description && <p className="text-slate-300">{description}</p>}
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCategoryId && (
                                            <Badge variant="secondary">Category: {categories.find((c) => c.id === selectedCategoryId)?.name}</Badge>
                                        )}
                                        {selectedModelId && (
                                            <Badge >Model: {models.find((m) => m.brand === selectedModelId)?.brand}</Badge>
                                        )}
                                        {pricePerDay && <Badge >Price: ${pricePerDay}</Badge>}
                                        {discount && <Badge >Discount: {discount}%</Badge>}
                                        {stock && <Badge >Quantity: {stock}</Badge>}
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
                                            <Badge >{images.length} image{images.length !== 1 ? "s" : ""}</Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>
        </>
    )
}

export default CreateCars
