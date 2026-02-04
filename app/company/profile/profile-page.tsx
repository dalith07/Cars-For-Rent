/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Phone, Star, MapPin, Landmark, FileText } from "lucide-react";
import { CompanyHeader } from "@/components/company/company-header";
import { auth } from "@/auth";
import { getCompanyProfileByOwner } from "@/actions/company/profile";
import Image from "next/image";
import { OpenMapLink } from "@/components/OpenMapLink";
import AnimatedCounter from "@/components/ui/animated-counter";

const ProfilePage = async () => {
    const session = await auth();
    if (!session?.user?.id) return null;

    const company = await getCompanyProfileByOwner(session.user.id);
    if (!company) return <div className="p-6">Company not found</div>;

    // 🔢 Revenue last 30 days
    const THIRTY_DAYS_AGO = new Date();
    THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

    const revenue30d = company.orders
        .filter(
            (o) => o.status === "COMPLETED" && new Date(o.createdAt) >= THIRTY_DAYS_AGO
        )
        .reduce((sum, o) => sum + o.totalPrice, 0);

    const unknown = "Unknown";

    return (
        <div className="flex flex-1 flex-col">
            <CompanyHeader
                title="Company Profile"
                description="View and manage your company information"
            />

            <main className="flex flex-1 flex-col gap-6 p-6">
                <div className="grid gap-6 md:grid-cols-3">

                    {/* ================= LEFT ================= */}
                    <Card className="md:col-span-2 bg-amber-800 text-white">
                        <CardHeader>
                            <div className="flex justify-between">
                                <div className="flex gap-4 items-center">
                                    <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-amber-700">
                                        {company.logo ? (
                                            <Image src={company.logo} alt="Logo" width={50} height={50} />
                                        ) : (
                                            <Building2 className="text-primary" />
                                        )}
                                    </div>

                                    <div>
                                        <CardTitle className="text-xl">{company.name}</CardTitle>
                                        <p className="text-sm text-gray-400">
                                            Established {new Date(company.createdAt).getFullYear()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button disabled>Edit Profile</Button>
                                    <Button variant="destructive" disabled>Remove Company</Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* ABOUT */}
                            <section>
                                <h3 className="font-semibold mb-2">About</h3>
                                <p className="text-sm text-gray-400">
                                    {company.description || unknown}
                                </p>
                            </section>

                            {/* CONTACT */}
                            <section className="grid md:grid-cols-2 gap-4">
                                <Info icon={Mail} label="Email" value={company.email} />
                                <Info icon={Phone} label="Phone" value={company.phone} />
                                <Info icon={Star} label="Status" value={company.status} />

                                <div className="flex gap-3">
                                    <MapPin className="text-primary" />
                                    <div>
                                        <p className="text-xs text-gray-400">Location :</p>
                                        {company.city && company.address ? (
                                            <OpenMapLink city={company.city} address={company.address} />
                                        ) : (
                                            <p className="text-sm">{unknown}</p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* BANK INFO */}
                            <section>
                                <h3 className="font-semibold mb-2">Bank Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Info icon={Landmark} label="Bank Name" value={company.bankName} />
                                    <Info label="Account Number" value={company.bankAccount} />
                                    <Info label="Account Holder" value={company.bankHolder} />
                                </div>
                            </section>

                            {/* LEGAL INFO */}
                            <section>
                                <h3 className="font-semibold mb-2">Legal Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Info icon={FileText} label="Registration Number" value={company.registrationNumber} />
                                    <Info label="Document" value={company.documentUrl ? "Uploaded" : unknown} />
                                </div>
                            </section>
                        </CardContent>
                    </Card>

                    {/* ================= RIGHT ================= */}
                    <div className="space-y-6">
                        <Card className="bg-amber-800 text-white">
                            <CardHeader>
                                <CardTitle>Business Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Stat label="Total Vehicles" value={company.cars.length} />
                                <Stat label="Total Rentals" value={company.orders.length} />
                                <Stat
                                    label="Active Customers"
                                    value={new Set(company.orders.map(o => o.userId)).size}
                                />
                                <Stat
                                    label="Revenue (30d)"
                                    value={<><AnimatedCounter value={revenue30d} /> DT</>}
                                />
                            </CardContent>
                        </Card>

                        <Card className="bg-amber-800 text-white">
                            <CardHeader>
                                <CardTitle>Verification</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between">
                                    <span>Status</span>
                                    <Badge>{company.status}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ProfilePage;

/* ================= HELPERS ================= */
const Info = ({ icon: Icon, label, value }: any) => (
    <div className="flex gap-3">
        {Icon && <Icon className="text-primary" />}
        <div>
            <p className="text-xs text-gray-400">{label} :</p>
            <p className="text-sm font-medium">{value || "Unknown"}</p>
        </div>
    </div>
);

const Stat = ({ label, value }: any) => (
    <div className="flex justify-between">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="font-semibold">{value}</span>
    </div >
);
