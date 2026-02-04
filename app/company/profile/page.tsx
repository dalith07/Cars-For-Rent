// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Building2, Mail, Phone, MapPin, Star } from "lucide-react"
// import { CompanyHeader } from "@/components/company/company-header"

// export default function CompanyProfilePage() {
//     return (
//         <div className="flex flex-1 flex-col">
//             <CompanyHeader title="Company Profile" description="View and manage your company information" />
//             <main className="flex flex-1 flex-col gap-6 p-6">
//                 <div className="grid gap-6 md:grid-cols-3">
//                     <Card className="md:col-span-2">
//                         <CardHeader>
//                             <div className="flex items-start justify-between">
//                                 <div className="flex items-center gap-4">
//                                     <div className="flex size-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
//                                         <Building2 className="size-8" />
//                                     </div>
//                                     <div>
//                                         <CardTitle className="text-2xl">Premium Auto Rentals</CardTitle>
//                                         <p className="text-sm text-muted-foreground">Established 2018</p>
//                                     </div>
//                                 </div>
//                                 <Button>Edit Profile</Button>
//                             </div>
//                         </CardHeader>
//                         <CardContent className="space-y-6">
//                             <div>
//                                 <h3 className="mb-2 font-semibold">About</h3>
//                                 <p className="text-sm text-muted-foreground leading-relaxed">
//                                     We are a premium car rental company offering a wide range of vehicles from economy to luxury. With
//                                     over 5 years of experience, we pride ourselves on excellent customer service and well-maintained
//                                     vehicles.
//                                 </p>
//                             </div>

//                             <div className="grid gap-4 md:grid-cols-2">
//                                 <div className="flex items-center gap-3">
//                                     <Mail className="size-4 text-muted-foreground" />
//                                     <div>
//                                         <p className="text-xs text-muted-foreground">Email</p>
//                                         <p className="text-sm font-medium">contact@premiumauto.com</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <Phone className="size-4 text-muted-foreground" />
//                                     <div>
//                                         <p className="text-xs text-muted-foreground">Phone</p>
//                                         <p className="text-sm font-medium">+1 (555) 123-4567</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <MapPin className="size-4 text-muted-foreground" />
//                                     <div>
//                                         <p className="text-xs text-muted-foreground">Location</p>
//                                         <p className="text-sm font-medium">123 Main St, San Francisco, CA</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <Star className="size-4 text-muted-foreground" />
//                                     <div>
//                                         <p className="text-xs text-muted-foreground">Rating</p>
//                                         <p className="text-sm font-medium">4.8 / 5.0 (142 reviews)</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <div className="space-y-6">
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Business Stats</CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-muted-foreground">Total Vehicles</span>
//                                     <span className="font-semibold">24</span>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-muted-foreground">Total Rentals</span>
//                                     <span className="font-semibold">486</span>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-muted-foreground">Active Customers</span>
//                                     <span className="font-semibold">152</span>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-muted-foreground">Revenue (30d)</span>
//                                     <span className="font-semibold">$12,450</span>
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Verification Status</CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-3">
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm">Business License</span>
//                                     <Badge>Verified</Badge>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm">Insurance</span>
//                                     <Badge>Verified</Badge>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm">Tax ID</span>
//                                     <Badge>Verified</Badge>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     )
// }

///////////////////////////////////////////////////////////////////////////////////

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Building2, Mail, Phone, Star, MapPin } from "lucide-react";
// import { CompanyHeader } from "@/components/company/company-header";
// import { auth } from "@/auth";
// import { getCompanyProfileByOwner } from "@/actions/company/profile";
// import Image from "next/image";
// import { OpenMapLink } from "@/components/OpenMapLink";
// import AnimatedCounter from "@/components/ui/animated-counter";

// export default async function CompanyProfilePage() {
//     const session = await auth();

//     if (!session?.user?.id) {
//         return null;
//     }

//     const company = await getCompanyProfileByOwner(session.user.id);

//     if (!company) {
//         return <div className="p-6">Company not found</div>;
//     }


//     // 🔢 Calculate revenue of last 30 days
//     const THIRTY_DAYS_AGO = new Date();
//     THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

//     const revenue30d = company.orders
//         .filter(order =>
//             order.status === "COMPLETED" &&
//             new Date(order.createdAt) >= THIRTY_DAYS_AGO
//         )
//         .reduce((total, order) => total + order.totalPrice, 0);

//     return (
//         <div className="flex flex-1 flex-col">
//             <CompanyHeader
//                 title="Company Profile"
//                 description="View and manage your company information"
//             />

//             <main className="flex flex-1 flex-col gap-6 p-6">
//                 <div className="grid gap-6 md:grid-cols-3">
//                     {/* LEFT */}
//                     <Card className="md:col-span-2">
//                         <CardHeader>
//                             <div className="flex items-start justify-between">
//                                 <div className="flex items-center gap-4">

//                                     <div className="flex size-22 items-center justify-center rounded-lg bg-primary/20 shrink-0">
//                                         {company.logo ? (
//                                             <Image
//                                                 src={company.logo}
//                                                 alt="logo"
//                                                 width={50}
//                                                 height={50}
//                                                 className="object-cover"
//                                             />
//                                         ) : (
//                                             <Building2 className="size-8 text-primary" />
//                                         )}
//                                     </div>

//                                     <div>
//                                         <CardTitle className="lg:text-2xl text-lg">
//                                             {company.name}
//                                         </CardTitle>
//                                         <p className="text-sm text-gray-400">
//                                             Established {new Date(company.createdAt).getFullYear()}
//                                         </p>
//                                     </div>

//                                 </div>

//                                 <div className="flex flex-col justify-between h-full">
//                                     <Button className=" hover:cursor-pointer">Edit Profile</Button>
//                                     <Button variant="destructive" className="mt-4 hover:cursor-pointer">Remove Company</Button>
//                                 </div>

//                             </div>
//                         </CardHeader>

//                         <CardContent className="space-y-6">
//                             <div>
//                                 <h3 className="mb-2 font-semibold">About</h3>
//                                 <p className="text-sm text-muted-foreground leading-relaxed">
//                                     {/* {company.description } */}
//                                     We are a premium car rental company offering a wide range of vehicles from economy to luxury. With over 5 years of experience, we pride ourselves on excellent customer service and well-maintained vehicles.
//                                 </p>
//                             </div>

//                             <div className="grid gap-4 md:grid-cols-2">
//                                 <div className="flex items-center gap-3">
//                                     <Mail className="size-6 text-primary" />
//                                     <div>
//                                         <p className="text-xs text-gray-400">Email:</p>
//                                         <p className="text-sm font-medium hover:cursor-pointer">{company.email}</p>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center gap-3">
//                                     <Phone className="size-6 text-primary" />
//                                     <div>
//                                         <p className="text-xs text-muted-foreground">Phone:</p>
//                                         <p className="text-sm font-medium hover:cursor-pointer">{company.phone}</p>
//                                     </div>
//                                 </div>

//                                 {/* <div className="flex items-center gap-3">
//                                     <MapPin className="size-6 text-primary" />
//                                     <div>
//                                         <p className="text-xs text-muted-foreground">Location</p>
//                                         <Link href={`${company.location}`} className="">
//                                             <p className="text-sm font-medium">
//                                                 {company.city}, {company.address}
//                                             </p>
//                                         </Link>
//                                     </div>
//                                 </div> */}

//                                 <div className="flex items-center gap-3">
//                                     <MapPin className="size-6 text-primary" />
//                                     <div>
//                                         <p className="text-xs text-muted-foreground">Location</p>
//                                         <OpenMapLink
//                                             city={company.city}
//                                             address={company.address}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center gap-3">
//                                     <Star className="size-6 text-primary" />
//                                     <div>
//                                         <p className="text-xs text-muted-foreground">Status</p>
//                                         <p className="text-sm font-medium">{company.status}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* RIGHT */}
//                     <div className="space-y-6">
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Business Stats</CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-muted-foreground">
//                                         Total Vehicles
//                                     </span>
//                                     <span className="font-semibold">{company.cars.length}</span>
//                                 </div>

//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-muted-foreground">
//                                         Total Rentals
//                                     </span>
//                                     <span className="font-semibold">{company.orders.length}</span>
//                                 </div>

//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-muted-foreground">
//                                         Active Customers
//                                     </span>
//                                     <span className="font-semibold">
//                                         {
//                                             new Set(company.orders.map((o) => o.userId)).size
//                                         }
//                                     </span>
//                                 </div>

//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-muted-foreground">
//                                         Revenue (30d)
//                                     </span>

//                                     <span className="font-bold flex items-center text-lg text-primary">
//                                         <AnimatedCounter value={revenue30d} />
//                                         <span>DT</span>
//                                     </span>
//                                 </div>

//                             </CardContent>
//                         </Card>

//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Verification Status</CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-3">
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm">Company Status</span>
//                                     <Badge>{company.status}</Badge>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }


/////////////////////////////////////////////////////////////////////////
import ProfilePage from "./profile-page";

export default async function CompanyProfilePage() {


    return (
        <ProfilePage />
    );
}



