"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CreateCompanyPage() {
    const router = useRouter();

    const [phone, setPhone] = useState("");
    const [checkbox, setCheckbox] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!checkbox) {
            setError("Please confirm you understand the terms.");
            return;
        }

        if (phone.length !== 8) {
            setError("Phone number must be exactly 8 digits.");
            return;
        }

        setError("");

        startTransition(() => {
            // simulate success
            setSuccess(true);

            // redirect after 1 second
            setTimeout(() => {
                router.push("/company/dashboard");
            }, 1000);
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-900 to-green-900 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-gray-800 rounded-2xl p-8 shadow-2xl text-gray-100"
            >
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold mb-4 text-center"
                >
                    Become a Company Owner
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                >
                    Please read the instructions carefully, enter your phone number,
                    check the confirmation box, and then click submit.
                </motion.p>

                <div className="space-y-4">
                    <Label>Add your phone number:</Label>

                    <Input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={8}
                        placeholder="99 999 999"
                        value={phone}
                        onChange={(e) => {
                            const onlyNumbers = e.target.value.replace(/\D/g, "");
                            setPhone(onlyNumbers.slice(0, 8));
                        }}
                        className="bg-white/10 text-white border-white/20 placeholder-amber-500/70 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    />

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={checkbox}
                            onChange={(e) => setCheckbox(e.target.checked)}
                            className="w-5 h-5 accent-blue-500"
                        />
                        <label>I understand and want to begin.</label>
                    </div>

                    {error && <p className="text-red-400">{error}</p>}
                    {success && (
                        <p className="text-green-400">
                            Success! Redirecting to your dashboard...
                        </p>
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || !checkbox || phone.length !== 8}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg"
                    >
                        Submit
                    </Button>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 text-gray-400 text-sm space-y-2"
                >
                    <p>
                        1. How it works: choose a product, generate a referral link,
                        track sales.
                    </p>
                    <p>
                        2. How you get paid: commission percentage on each sale via
                        referral link.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
