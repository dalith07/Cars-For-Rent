"use client";
export const dynamic = 'force-dynamic';


import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createCompany, deleteCompany, getUserCompany } from "@/actions/dashboard/company/company";
import { Progress } from "@/components/ui/progress";
import { FileImage, Loader2, X } from "lucide-react";
import Dropzone, { FileRejection } from "react-dropzone";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import Link from "next/link";

type Props = {
    userCompany: {
        id: string;
        status: "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED";
        owner: { role: string };
    } | null;
};


type FieldErrors = {
    name?: string;
    email?: string;
    phone?: string;
    city?: string;
    address?: string;
};

export default function CreateCompanyAccount({ userCompany }: Props) {
    const router = useRouter();

    const [openForm, setOpenForm] = useState(false);
    const [checkbox, setCheckbox] = useState(false);

    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [bankName, setBankName] = useState("");
    const [bankAccount, setBankAccount] = useState("");
    const [bankHolder, setBankHolder] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [documentUrl, setDocumentUrl] = useState<File | null>(null);
    const [logo, setLogo] = useState("");
    const [isPending, startTransition] = useTransition();

    const title = "Become a Company Owner";
    const [displayed, setDisplayed] = useState("");
    const [index, setIndex] = useState(0);

    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);

    // 🔥 NEW ERROR SYSTEM
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [globalError, setGlobalError] = useState("");

    const [success, setSuccess] = useState(() => userCompany !== null);

    const [userCompanyState, setUserCompanyState] = useState(userCompany);

    const isVerified =
        userCompanyState?.status === "APPROVED" &&
        userCompanyState?.owner.role === "COMPANY_OWNER";

    // 3️⃣ poll for updates every 5s

    useEffect(() => {
        if (!userCompanyState) return;

        const interval = setInterval(async () => {
            const updatedCompany = await getUserCompany();
            if (updatedCompany && updatedCompany.status !== userCompanyState.status) {
                setUserCompanyState(updatedCompany);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [userCompanyState]);

    useEffect(() => {
        if (openForm) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDisplayed("Please fill in the inputs");
            return;
        }

        if (index < title.length) {
            const timeout = setTimeout(() => {
                setDisplayed((prev) => prev + title[index]);
                setIndex(index + 1);
            }, 150); // سرعة الكتابة
            return () => clearTimeout(timeout);
        } else {
            const loopTimeout = setTimeout(() => {
                setDisplayed("");
                setIndex(0);
            }, 3000);
            return () => clearTimeout(loopTimeout);
        }
    }, [index, openForm]);

    const [createdCompanyId, setCreatedCompanyId] = useState<string | undefined>(
        () => userCompany?.id
    );

    useEffect(() => {
        document.body.style.overflow = success ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [success]);

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: async ([data]) => {
            setLogo(data.ufsUrl || "/logo-company_2.png");
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onDropRejected = (rejectedFiles: FileRejection[]) => { };

    const validate = () => {
        const errors: FieldErrors = {};

        if (!name) errors.name = "Company name is required";
        if (!email) errors.email = "Email is required";
        if (phone.length !== 8) errors.phone = "Phone must be 8 digits";
        if (!city) errors.city = "City is required";
        if (!address) errors.address = "Address is required";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (!openForm) {
            if (!checkbox) {
                setGlobalError("Please confirm you understand the terms.");
                return;
            }
            setGlobalError("");
            setOpenForm(true);
            return;
        }

        // ✅ validation هنا فقط
        if (!validate()) {
            setGlobalError("Please fix the errors below.");
            return;
        }

        setGlobalError("");

        startTransition(async () => {
            const result = await createCompany({
                name,
                email,
                logo,
                phone,
                city,
                address,
                location,
                lat: Number(lat),
                lng: Number(lng),
                description,
                bankName,
                bankAccount,
                bankHolder,
                registrationNumber,
                documentUrl: documentUrl ? documentUrl.name : undefined, // send file name or url
            });

            if (result.success) {
                setSuccess(true);
                setCreatedCompanyId(result.data?.id);
            } else {
                setGlobalError(result.error || "Failed to create company.");
            }
        });
    };

    const handleCancel = async () => {
        if (createdCompanyId) {
            await deleteCompany({ companyId: createdCompanyId });
        }

        setSuccess(false);
        setOpenForm(false);
        setCheckbox(false);
        setPhone("");
        setName("");
        setEmail("");
        setCity("");
        setAddress("");
        setLocation("");
        setLogo("");
        setGlobalError("");

        router.push("/");
    };

    return (
        <>
            <div className="min-h-screen pt-24 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="
  w-full max-w-2xl
  bg-white dark:bg-gray-900
  border border-gray-200 dark:border-blue-400/20
  rounded-2xl p-8 shadow-2xl
  text-gray-900 dark:text-gray-100
  relative
"                >
                    {/* TITLE */}
                    <h1 className="text-3xl font-bold mb-4 text-center">
                        {displayed}
                        {!openForm &&
                            <span className="blinking-cursor">|</span>
                        }
                    </h1>
                    {!openForm && <p className="mb-6 text-sm text-center text-red-600 font-bold animate-pulse">
                        Please read the instructions carefully, then create your company. !
                    </p>}

                    {/* 🔴 GLOBAL ERROR */}
                    {globalError && (
                        <div className="mb-6 flex justify-between items-center border border-red-500/30 bg-red-500/10 p-3 rounded-lg text-red-400">
                            <span>⚠️ {globalError}</span>
                            <button onClick={() => setGlobalError("")}>
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {openForm && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                opacity: { duration: 0.3 },
                                y: { duration: 0.3 },
                                x: { duration: 0.4 },
                            }}
                            className="space-y-4 mb-8 pt-8"
                        >
                            {/* COMPANY NAME */}
                            <div>
                                <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">Company Name:</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="My Company"
                                    className="
    bg-blue-600/10
    border border-blue-600/30
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/70
    focus:ring-1 focus:ring-blue-600/40
  "
                                />
                                {fieldErrors.name && <p className="text-xs text-red-400">{fieldErrors.name}</p>}
                            </div>

                            {/* EMAIL + PHONE */}
                            <div className="flex items-center justify-between ">
                                <div>
                                    <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">Email :</Label>
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="company@gmail.com"
                                        className="
    bg-blue-600/10
    border border-blue-600/30
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/70
    focus:ring-1 focus:ring-blue-600/40
  "
                                    />
                                    {fieldErrors.email && <p className="text-xs text-red-400">{fieldErrors.email}</p>}
                                </div>

                                <div>
                                    <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">Phone Number :</Label>
                                    <Input
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))
                                        }
                                        placeholder="99 999 999"
                                        className="
    bg-blue-600/10
    border border-blue-600/30
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/70
    focus:ring-1 focus:ring-blue-600/40
  "
                                    />
                                    {fieldErrors.phone && <p className="text-xs text-red-400">{fieldErrors.phone}</p>}
                                </div>
                            </div>

                            {/* CITY + ADDRESS */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">City:</Label>
                                    <Input
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Tunis"
                                        className="
    bg-blue-600/10
    border border-blue-600/30
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/70
    focus:ring-1 focus:ring-blue-600/40
  "
                                    />
                                    {fieldErrors.city && <p className="text-xs text-red-400">{fieldErrors.city}</p>}
                                </div>

                                <div>
                                    <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">Address:</Label>
                                    <Input
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Street, building..."
                                        className="
    bg-blue-600/10
    border border-blue-600/30
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/70
    focus:ring-1 focus:ring-blue-600/40
  "
                                    />
                                    {fieldErrors.address && <p className="text-xs text-red-400">{fieldErrors.address}</p>}
                                </div>
                            </div>

                            {/* LOCATION */}
                            <div>
                                <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">Company Location :</Label>
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Google Maps URL"
                                    className="
    bg-blue-600/10
    border border-blue-600/30
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/70
    focus:ring-1 focus:ring-blue-600/40
  "
                                />
                            </div>

                            {/* LAT + LNG */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="w-full">
                                    <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">
                                        Latitude
                                    </Label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={lat}
                                        onChange={(e) => setLat(e.target.value)}
                                        placeholder="36.81897"
                                        className="
    bg-blue-600/10
    border border-blue-600/30
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/70
    focus:ring-1 focus:ring-blue-600/40
  "
                                    />
                                </div>

                                <div className="w-full">
                                    <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">
                                        Longitude
                                    </Label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={lng}
                                        onChange={(e) => setLng(e.target.value)}
                                        placeholder="10.16579"
                                        className="
    bg-blue-600/10
    border border-blue-600/30
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/70
    focus:ring-1 focus:ring-blue-600/40
  "
                                    />
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div className={`relative ${description.length >= 250 ? "opacity-80 pointer-events-none" : ""}`}>
                                <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">Company Description:</Label>
                                <textarea
                                    value={description}
                                    onChange={(e) => {
                                        // limit to 250 characters
                                        if (e.target.value.length <= 250) {
                                            setDescription(e.target.value);
                                        }
                                    }}
                                    rows={4}
                                    placeholder="Short description about your company"
                                    className="
    w-full p-2 resize-none rounded-md
    bg-blue-600/10
    border border-blue-600/20
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/50
    focus:ring-1 focus:ring-blue-600/40
  "                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                                    {description.length}/250
                                </p>
                            </div>

                            {/* COMPANY LOGO */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">Company Logo :</Label>
                                    <div className="w-24 h-24 border border-dotted rounded-2xl flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={logo || ""}
                                            width={100}
                                            height={100}
                                            alt="logo"
                                            className="object-cover w-full h-full rounded-full"
                                        />
                                    </div>
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
                                            <span className="block border border-dashed border-blue-400 rounded-lg p-2 mt-2 text-center cursor-pointer font-semibold">
                                                {uploadProgress > 0 ? (
                                                    <div className="w-full">
                                                        <Progress
                                                            value={uploadProgress}
                                                            className="my-2 w-24 h-2 bg-gray-300"
                                                        />
                                                        <p className="text-xs text-white mt-1">{uploadProgress}%</p>
                                                    </div>
                                                ) : (
                                                    <span className="flex flex-row items-center gap-2">
                                                        <FileImage className="text-primary" /> Choose file
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </Dropzone>

                            </div>

                            {/* BANK INFO */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">Bank Name:</Label>
                                    <Input
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        placeholder="Bank Name"
                                        className="
    bg-blue-600/10
    border border-blue-600/30
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/70
    focus:ring-1 focus:ring-blue-600/40
  "
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">Bank Account (IBAN/RIB):</Label>
                                    <Input
                                        value={bankAccount}
                                        onChange={(e) => setBankAccount(e.target.value)}
                                        placeholder="IBAN or RIB"
                                        className="
    bg-blue-600/10
    border border-blue-600/30
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/70
    focus:ring-1 focus:ring-blue-600/40
  "
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">Bank Account Holder:</Label>
                                <Input
                                    value={bankHolder}
                                    onChange={(e) => setBankHolder(e.target.value)}
                                    placeholder="Account Holder Name"
                                    className="
    bg-blue-600/10
    border border-blue-600/30
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/70
    focus:ring-1 focus:ring-blue-600/40
  "
                                />
                            </div>

                            {/* LEGAL INFO */}
                            <div>
                                <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">Registration Number:</Label>
                                <Input
                                    value={registrationNumber}
                                    onChange={(e) => setRegistrationNumber(e.target.value)}
                                    placeholder="Matricule Fiscale / Register"
                                    className="
    bg-blue-600/10
    border border-blue-600/30
    text-gray-900 dark:text-white
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    focus:border-blue-600/70
    focus:ring-1 focus:ring-blue-600/40
  "
                                />
                            </div>

                            <div className="mt-2">
                                <Label className="text-sm mb-1 text-gray-400 dark:text-gray-300">Upload Legal Document (PDF/Image):</Label>
                                <Dropzone
                                    accept={{ "application/pdf": [".pdf"], "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                                    onDropAccepted={(files) => setDocumentUrl(files[0])}
                                    onDropRejected={() => { }}
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <div
                                            {...getRootProps()}
                                            className="p-3 text-sm rounded-lg text-center cursor-pointer border border-gray-400 transition hover:bg-gray-800/50"
                                        >
                                            <input {...getInputProps()} />
                                            {documentUrl ? (
                                                <p>{documentUrl.name}</p>
                                            ) : (
                                                <span className='flex justify-center items-center gap-2'>
                                                    <FileImage className='text-primary' /> Click or drag file here
                                                </span>

                                            )}
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                        </motion.div>
                    )}

                    {/* CHECKBOX */}
                    {!openForm && <div className="flex items-center space-x-2 mb-4">
                        <input
                            type="checkbox"
                            checked={checkbox}
                            onChange={(e) => setCheckbox(e.target.checked)}
                            className="w-5 h-5 accent-blue-500 hover:cursor-pointer"
                        />
                        <label>I understand and want to begin.</label>
                    </div>}

                    <div className="flex items-center justify-end gap-4">

                        <Button
                            variant="destructive"
                            disabled={isPending || checkbox}
                            className="hover:cursor-pointer"
                        >
                            <Link href={"/"}>
                                Cancel
                            </Link>
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || !checkbox}
                            className="hover:cursor-pointer text-white bg-primary/80 hover:bg-primary/90 hover:text-white duration-500"
                        >
                            {openForm ? "Submit Company" : "Create Company"}
                        </Button>
                    </div>

                    {/* HOW IT WORKS */}
                    {!openForm && <div className="mt-8 text-gray-600 dark:text-gray-300 text-sm space-y-2">
                        <p>1. Choose a product, generate a referral link, and track sales.</p>
                        <p>2. Earn commission on every successful sale.</p>
                        <p>3. After creating a company, you can monitor everything in the dashboard.</p>
                    </div>}
                </motion.div>

                {/* 🔥 SUCCESS OVERLAY */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="max-w-md w-full bg-gray-900 p-8 rounded-2xl text-center border border-white/10 shadow-2xl"
                        >
                            {isVerified ? (
                                <>
                                    <h2 className="text-2xl font-bold text-green-400 mb-4">
                                        You Have Company New
                                    </h2>

                                    <p className="text-gray-200 mb-6">
                                        Your company has been verified and approved!
                                    </p>

                                    <Button
                                        onClick={() => router.push("/company")}
                                        className="hover:cursor-pointer bg-primary/20 hover:bg-primary/10 text-white hover:text-white duration-500 border border-primary/20 w-full"
                                    >
                                        Go to Company Dashboard
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <h2 className="lg:text-2xl font-bold text-green-400 mb-4">
                                        Company Submitted Successfully
                                    </h2>

                                    <p className="text-gray-200 mb-3">
                                        Your request has been sent to the admin.
                                    </p>

                                    <p className="text-gray-400 text-sm mb-2">
                                        ⏳ Please wait up to{" "}
                                        <span className="text-white font-semibold animate-pulse">24 hours</span>{" "}
                                        for approval.
                                    </p>

                                    <p className="text-blue-400 text-xs mb-4 ">
                                        <Loader2 className="animate-spin m-auto" />
                                    </p>

                                    <div className="flex items-center justify-center gap-4 mt-4">
                                        {/* CANCEL */}
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            className="hover:cursor-pointer bg-destructive/20 hover:bg-destructive/10 text-white hover:text-white duration-500 border border-destructive/20 "
                                        >
                                            Cancel
                                        </Button>

                                        <Link href={"/"}>
                                            <Button
                                                className="hover:cursor-pointer bg-primary/20 hover:bg-primary/10 text-white hover:text-white duration-500 border border-primary/20 "
                                            >
                                                Back Home
                                            </Button>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}

            </div>
        </>
    );
}