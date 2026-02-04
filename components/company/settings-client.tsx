/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CompanyHeader } from "@/components/company/company-header";
import { updateCompanyInfo } from "@/actions/company/settings";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";

export default function SettingsPage({ company }: any) {
    const [name, setName] = useState(company?.name || "Unknown");
    const [email, setEmail] = useState(company?.email || "Unknown");
    const [phone, setPhone] = useState(company?.phone || "Unknown");

    async function handleUpdate() {
        await updateCompanyInfo(company.id, {
            name,
            email,
            phone,
        });
    }

    return (
        // <div className="flex flex-1 flex-col">
        //     <CompanyHeader title="Settings" description="Manage your account and preferences" />

        //     <main className="flex flex-1 flex-col gap-6 p-6">
        //         <Card>
        //             <CardHeader>
        //                 <CardTitle>Company Info</CardTitle>
        //             </CardHeader>

        //             <CardContent className="space-y-4">
        //                 <div>
        //                     <Label>Company Name</Label>
        //                     <Input value={name} onChange={(e) => setName(e.target.value)} />
        //                 </div>

        //                 <div>
        //                     <Label>Email</Label>
        //                     <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        //                 </div>

        //                 <div>
        //                     <Label>Phone</Label>
        //                     <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        //                 </div>

        //                 <Button onClick={handleUpdate}>Save Changes</Button>
        //             </CardContent>
        //         </Card>
        //     </main>
        // </div>

        <div className="flex flex-1 flex-col">
            <CompanyHeader title="Settings" description="Manage your account and preferences" />
            <main className="flex flex-1 flex-col gap-6 p-6">
                <Card className="bg-amber-800 text-white">
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription className="text-gray-400">Manage your account information and security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-gray-400">Company Name :</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    defaultValue="Premium Auto Rentals"
                                    value={name}
                                    className="w-2/4 border-amber-700 bg-amber-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-400">Email Address :</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    defaultValue="contact@premiumauto.com"
                                    value={email}
                                    className="w-2/4 border-amber-700 bg-amber-800"
                                />

                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-400">Phone Number :</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="tel"
                                    defaultValue="+1 (555) 123-4567"
                                    value={phone}
                                    className="w-2/4 border-amber-700 bg-amber-800"
                                />

                            </div>
                        </div>

                        <div className="pt-4 flex justify-end items-center">
                            {/* <Button variant="outline">Change Password</Button> */}
                            <Button className="hover:cursor-pointer">Update All</Button>

                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-amber-800 text-white">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription className="text-gray-400">Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-gray-400">Receive email updates about your orders</p>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="">New Order Alerts</Label>
                                <p className="text-sm text-gray-400">Get notified when a new order is placed</p>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Payment Notifications</Label>
                                <p className="text-sm text-gray-400">Get notified about payments and refunds</p>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Marketing Emails</Label>
                                <p className="text-sm text-gray-400">Receive product updates and tips</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-amber-800 text-white">                    <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription className="text-gray-400">Manage your payment and payout options</CardDescription>
                </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg border border-amber-700 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Bank Account ••••1234</p>
                                    <p className="text-sm text-muted-foreground">Default payout method</p>
                                </div>
                                <Button size="sm">
                                    Edit
                                </Button>
                            </div>
                        </div>
                        <Button variant="outline" className="hover:cursor-pointer bg-amber-800 hover:bg-amber-700 border-amber-700 hover:text-white duration-500">Add Payment Method</Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

// // <div className="flex flex-1 flex-col">
// //         <CompanyHeader title="Settings" description="Manage your account and preferences" />
// //         <main className="flex flex-1 flex-col gap-6 p-6">
// //             <Card>
// //                 <CardHeader>
// //                     <CardTitle>Account Settings</CardTitle>
// //                     <CardDescription>Manage your account information and security</CardDescription>
// //                 </CardHeader>
// //                 <CardContent className="space-y-6">
// //                     <div className="space-y-2">
// //                         <Label>Company Name</Label>
// //                         <div className="flex gap-2">
// //                             <input
// //                                 type="text"
// //                                 defaultValue="Premium Auto Rentals"
// //                                 className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors"
// //                             />
// //                             <Button variant="outline">Update</Button>
// //                         </div>
// //                     </div>

// //                     <div className="space-y-2">
// //                         <Label>Email Address</Label>
// //                         <div className="flex gap-2">
// //                             <input
// //                                 type="email"
// //                                 defaultValue="contact@premiumauto.com"
// //                                 className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors"
// //                             />
// //                             <Button variant="outline">Update</Button>
// //                         </div>
// //                     </div>

// //                     <div className="space-y-2">
// //                         <Label>Phone Number</Label>
// //                         <div className="flex gap-2">
// //                             <input
// //                                 type="tel"
// //                                 defaultValue="+1 (555) 123-4567"
// //                                 className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors"
// //                             />
// //                             <Button variant="outline">Update</Button>
// //                         </div>
// //                     </div>

// //                     <div className="pt-4">
// //                         <Button variant="outline">Change Password</Button>
// //                     </div>
// //                 </CardContent>
// //             </Card>

// //             <Card>
// //                 <CardHeader>
// //                     <CardTitle>Notifications</CardTitle>
// //                     <CardDescription>Manage how you receive notifications</CardDescription>
// //                 </CardHeader>
// //                 <CardContent className="space-y-4">
// //                     <div className="flex items-center justify-between">
// //                         <div className="space-y-0.5">
// //                             <Label>Email Notifications</Label>
// //                             <p className="text-sm text-muted-foreground">Receive email updates about your orders</p>
// //                         </div>
// //                         <Switch defaultChecked />
// //                     </div>

// //                     <div className="flex items-center justify-between">
// //                         <div className="space-y-0.5">
// //                             <Label>New Order Alerts</Label>
// //                             <p className="text-sm text-muted-foreground">Get notified when a new order is placed</p>
// //                         </div>
// //                         <Switch defaultChecked />
// //                     </div>

// //                     <div className="flex items-center justify-between">
// //                         <div className="space-y-0.5">
// //                             <Label>Payment Notifications</Label>
// //                             <p className="text-sm text-muted-foreground">Get notified about payments and refunds</p>
// //                         </div>
// //                         <Switch defaultChecked />
// //                     </div>

// //                     <div className="flex items-center justify-between">
// //                         <div className="space-y-0.5">
// //                             <Label>Marketing Emails</Label>
// //                             <p className="text-sm text-muted-foreground">Receive product updates and tips</p>
// //                         </div>
// //                         <Switch />
// //                     </div>
// //                 </CardContent>
// //             </Card>

// //             <Card>
// //                 <CardHeader>
// //                     <CardTitle>Payment Methods</CardTitle>
// //                     <CardDescription>Manage your payment and payout options</CardDescription>
// //                 </CardHeader>
// //                 <CardContent className="space-y-4">
// //                     <div className="rounded-lg border border-border p-4">
// //                         <div className="flex items-center justify-between">
// //                             <div>
// //                                 <p className="font-medium">Bank Account ••••1234</p>
// //                                 <p className="text-sm text-muted-foreground">Default payout method</p>
// //                             </div>
// //                             <Button variant="ghost" size="sm">
// //                                 Edit
// //                             </Button>
// //                         </div>
// //                     </div>
// //                     <Button variant="outline">Add Payment Method</Button>
// //                 </CardContent>
// //             </Card>
// //         </main>
// //     </div>



// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { CompanyHeader } from "@/components/company/company-header";
// import { updateCompanyInfo, deleteCompany } from "@/actions/company/settings";

// export default function SettingsPage({ company }: any) {
//     const [form, setForm] = useState({
//         name: company.name ?? "",
//         email: company.email ?? "",
//         phone: company.phone ?? "",
//         city: company.city ?? "",
//         address: company.address ?? "",
//         bankName: company.bankName ?? "",
//         bankAccount: company.bankAccount ?? "",
//     });

//     function onChange(e: any) {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     }

//     async function updateAll() {
//         await updateCompanyInfo(company.id, form);
//     }

//     async function updateField(field: string) {
//         await updateCompanyInfo(company.id, {
//             [field]: form[field as keyof typeof form],
//         });
//     }

//     async function removeCompany() {
//         if (!confirm("Are you sure you want to delete this company?")) return;
//         await deleteCompany(company.id);
//     }

//     return (
//         <div className="flex flex-1 flex-col">
//             <CompanyHeader
//                 title="Settings"
//                 description="Manage all company information"
//             />

//             <main className="flex flex-col gap-6 p-6">

//                 {/* ================= COMPANY INFO ================= */}
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Company Information</CardTitle>
//                     </CardHeader>

//                     <CardContent className="space-y-4">

//                         {/** NAME */}
//                         <Field
//                             label="Company Name"
//                             name="name"
//                             value={form.name}
//                             onChange={onChange}
//                             onUpdate={() => updateField("name")}
//                         />

//                         {/** EMAIL */}
//                         <Field
//                             label="Email"
//                             name="email"
//                             value={form.email}
//                             onChange={onChange}
//                             onUpdate={() => updateField("email")}
//                         />

//                         {/** PHONE */}
//                         <Field
//                             label="Phone"
//                             name="phone"
//                             value={form.phone}
//                             onChange={onChange}
//                             onUpdate={() => updateField("phone")}
//                         />

//                         {/** CITY */}
//                         <Field
//                             label="City"
//                             name="city"
//                             value={form.city}
//                             onChange={onChange}
//                             onUpdate={() => updateField("city")}
//                         />

//                         {/** ADDRESS */}
//                         <Field
//                             label="Address"
//                             name="address"
//                             value={form.address}
//                             onChange={onChange}
//                             onUpdate={() => updateField("address")}
//                         />

//                         {/** BANK */}
//                         <Field
//                             label="Bank Name"
//                             name="bankName"
//                             value={form.bankName}
//                             onChange={onChange}
//                             onUpdate={() => updateField("bankName")}
//                         />

//                         <Field
//                             label="Bank Account"
//                             name="bankAccount"
//                             value={form.bankAccount}
//                             onChange={onChange}
//                             onUpdate={() => updateField("bankAccount")}
//                         />

//                         <div className="flex justify-between pt-4">
//                             <Button onClick={updateAll}>Update All</Button>
//                             <Button variant="destructive" onClick={removeCompany}>
//                                 Remove Company
//                             </Button>
//                         </div>

//                     </CardContent>
//                 </Card>
//             </main>
//         </div>
//     );
// }

// /* ================= FIELD COMPONENT ================= */

// function Field({ label, name, value, onChange, onUpdate }: any) {
//     return (
//         <div className="space-y-2">
//             <Label>{label}</Label>
//             <div className="flex gap-2">
//                 <input
//                     name={name}
//                     value={value}
//                     onChange={onChange}
//                     className="flex h-9 w-full rounded-md border px-3 text-sm"
//                 />
//                 <Button variant="outline" onClick={onUpdate}>
//                     Update
//                 </Button>
//             </div>
//         </div>
//     );
// }
