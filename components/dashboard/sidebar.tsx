// "use client"

// import { LayoutDashboard, BarChart3, Users, ShoppingCart, Car, Settings, LogOut } from "lucide-react"
// import { cn } from "@/lib/utils"

// // interface SidebarProps {
// //     isOpen: boolean
// //     activePage: string
// //     onNavigate: (page: string) => void
// // }

// // export default function Sidebar({ isOpen, activePage, onNavigate }: SidebarProps) {
// export default function Sidebar() {

//     const menuItems = [
//         { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", url: "/dashboard", },
//         { id: "analytics", icon: BarChart3, label: "Analytics", url: "/analytics", },
//         { id: "users", icon: Users, label: "Users", url: "/users", },
//         { id: "orders", icon: ShoppingCart, label: "Orders", url: "/orders", },
//         { id: "cars", icon: Car, label: "Cars", url: "/cars", },
//         { id: "settings", icon: Settings, label: "Settings", url: "/settings", },
//     ]

//     return (
//         <aside
//             className={cn(
//                 "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out flex flex-col",
//                 // isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
//             )}
//         >
//             {/* Logo */}
//             <div className="p-5 border-b border-sidebar-border animate-scale-in">
//                 <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
//                         <span className="text-sm font-bold text-sidebar-primary-foreground">AD</span>
//                     </div>
//                     <span className="font-bold text-lg text-sidebar-foreground">Admin</span>
//                 </div>
//             </div>

//             {/* Menu Items */}
//             <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//                 {menuItems.map((item, index) => (
//                     <button
//                         key={index}
//                         // onClick={() => onNavigate(item.id)}
//                         className={cn(
//                             "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer group",
//                             // activePage === item.id
//                             //     ? "bg-linear-to-r from-primary/20 to-accent/10 text-primary border-l-2 border-primary shadow-sm"
//                             //     : "text-sidebar-foreground hover:bg-sidebar-accent/5",
//                         )}
//                         style={{
//                             animation: `slideInLeft 0.5s ease-out ${index * 0.1}s backwards`,
//                         }}
//                     >
//                         <item.icon className="w-5 h-5 shrink-0" />
//                         <span className="font-medium text-sm">{item.label}</span>
//                         {/* {activePage === item.id && <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />} */}
//                     </button>
//                 ))}
//             </nav>

//             {/* Bottom Section */}
//             <div className="p-4 border-t border-sidebar-border">
//                 <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/5 transition-colors cursor-pointer">
//                     <LogOut className="w-5 h-5" />
//                     <span className="font-medium text-sm">Logout</span>
//                 </button>
//             </div>
//         </aside>
//     )
// }



// "use client"

// import { LayoutDashboard, BarChart3, Users, ShoppingCart, Car, LogOut, Settings } from "lucide-react"
// import { cn } from "@/lib/utils"
// import Link from "next/link"

// export default function AppSidebar() {

//     const menuItems = [
//         { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", url: "/dashboard", },
//         { id: "analytics", icon: BarChart3, label: "Analytics", url: "/dashboard/analytics", },
//         { id: "users", icon: Users, label: "Users", url: "/dashboard/users", },
//         { id: "orders", icon: ShoppingCart, label: "Orders", url: "/dashboard/orders", },
//         { id: "cars", icon: Car, label: "Cars", url: "/dashboard/cars", },
//         { id: "settings", icon: Settings, label: "Settings", url: "/dashboard/settings", },
//     ]

//     return (
//         <aside
//             className={cn(
//                 "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out flex flex-col",
//                 // isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
//             )}
//         >
//             {/* Logo */}
//             <div className="p-5 border-b border-sidebar-border animate-scale-in">
//                 <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
//                         <span className="text-sm font-bold text-sidebar-primary-foreground">AD</span>
//                     </div>
//                     <span className="font-bold text-lg text-sidebar-foreground">Admin</span>
//                 </div>
//             </div>

//             {/* Menu Items */}
//             <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//                 {menuItems.map((item, index) => (
//                     <Link href={`${item.url}`} key={index}>
//                         <button
//                             key={index}
//                             // onClick={() => onNavigate(item.id)}
//                             className={cn(
//                                 "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer group",
//                                 // activePage === item.id
//                                 //     ? "bg-linear-to-r from-primary/20 to-accent/10 text-primary border-l-2 border-primary shadow-sm"
//                                 //     : "text-sidebar-foreground hover:bg-sidebar-accent/5",
//                             )}
//                             style={{
//                                 animation: `slideInLeft 0.5s ease-out ${index * 0.1}s backwards`,
//                             }}
//                         >
//                             <item.icon className="w-5 h-5 shrink-0" />
//                             <span className="font-medium text-sm">{item.label}</span>
//                             {/* {activePage === item.id && <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />} */}
//                         </button>
//                     </Link>
//                 ))}
//             </nav>

//             {/* Bottom Section */}
//             <div className="p-4 border-t border-sidebar-border">
//                 <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/5 transition-colors cursor-pointer">
//                     <LogOut className="w-5 h-5" />
//                     <span className="font-medium text-sm">Logout</span>
//                 </button>
//             </div>
//         </aside>
//     )
// }

"use client";

import { LayoutDashboard, BarChart3, Users, ShoppingCart, Car, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: SidebarProps) {
    const menuItems = [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", url: "/dashboard" },
        { id: "analytics", icon: BarChart3, label: "Analytics", url: "/dashboard/analytics" },
        { id: "users", icon: Users, label: "Users", url: "/dashboard/users" },
        { id: "orders", icon: ShoppingCart, label: "Orders", url: "/dashboard/orders" },
        { id: "cars", icon: Car, label: "Cars", url: "/dashboard/cars" },
        { id: "settings", icon: Settings, label: "Settings", url: "/dashboard/settings" },
    ];

    return (
        <>
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
            )}

            <aside
                className={cn(
                    "sticky top-0 z-40 w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:translate-x-0 lg:static"
                )}
            >
                <div className="p-5 border-b border-sidebar-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-sm font-bold text-sidebar-primary-foreground">AD</span>
                        </div>
                        <span className="font-bold text-lg text-sidebar-foreground">Admin</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {menuItems.map((item, index) => (
                        <Link href={item.url} key={item.id}>
                            <button
                                onClick={onClose}
                                className="w-full flex items-center group hover:cursor-pointer gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/5"
                                style={{ animation: `slideInLeft 0.5s ease-out ${index * 0.1}s backwards` }}
                            >
                                <item.icon className="w-5 h-5 group-hover:animate-bounce" />
                                <span className="font-medium text-sm">{item.label}</span>
                            </button>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-sidebar-border">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/5 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
