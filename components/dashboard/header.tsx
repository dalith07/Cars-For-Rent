// "use client"

// import { Menu, Bell, Search, X, Home } from "lucide-react"
// import Link from "next/link"

// interface HeaderProps {
//     onToggleSidebar: () => void
//     onNotificationsClick: () => void
//     showNotifications: boolean
// }

// export default function Header({ onToggleSidebar, onNotificationsClick, showNotifications }: HeaderProps) {
//     const notifications = [
//         { id: 1, message: "New user registered", time: "5 min ago" },
//         { id: 2, message: "Revenue target reached", time: "1 hour ago" },
//         { id: 3, message: "System update completed", time: "3 hours ago" },
//         { id: 4, message: "New comment on post", time: "1 day ago" },
//     ]

//     return (
//         <header className="border-b border-border bg-card backdrop-blur-md sticky top-0 z-40 animate-fade-in">
//             <div className="flex items-center justify-between px-6 py-4">
//                 {/* Left Section */}
//                 <div className="flex items-center gap-4">
//                     <button onClick={onToggleSidebar} className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden">
//                         <Menu className="w-5 h-5" />
//                     </button>

//                     {/* Search Bar */}
//                     <div className="hidden md:flex items-center gap-2 bg-muted/40 px-4 py-2 rounded-lg border border-border hover:border-primary/30 transition-colors">
//                         <Search className="w-4 h-4 text-muted-foreground" />
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-40"
//                         />
//                     </div>
//                 </div>

//                 {/* Right Section */}
//                 <div className="flex items-center gap-4 relative">
//                     {/* Notifications */}
//                     <button
//                         onClick={onNotificationsClick}
//                         className="p-2 hover:bg-muted rounded-lg transition-colors relative group"
//                     >
//                         <Bell className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
//                         <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
//                     </button>

//                     {/* Notifications Dropdown */}
//                     {showNotifications && (
//                         <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 animate-fade-in">
//                             <div className="flex items-center justify-between px-4 py-3 border-b border-border">
//                                 <h3 className="font-semibold text-foreground">Notifications</h3>
//                                 <button onClick={onNotificationsClick} className="p-1 hover:bg-muted rounded">
//                                     <X className="w-4 h-4" />
//                                 </button>
//                             </div>
//                             <div className="max-h-96 overflow-y-auto">
//                                 {notifications.map((notif) => (
//                                     <div
//                                         key={notif.id}
//                                         className="px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
//                                     >
//                                         <p className="text-sm text-foreground">{notif.message}</p>
//                                         <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="px-4 py-3 text-center border-t border-border">
//                                 <button className="text-sm text-primary hover:underline font-medium">View all notifications</button>
//                             </div>
//                         </div>
//                     )}

//                     {/* Profile */}
//                     {/* <button className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
//                         <div className="w-8 h-8 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center">
//                             <User className="w-4 h-4 text-primary-foreground" />
//                         </div>
//                     </button> */}

//                     <button className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
//                         <div className="w-8 h-8 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center">
//                             <Link href={"/"}>
//                                 <Home className="w-4 h-4 text-primary-foreground" />
//                             </Link>
//                         </div>
//                     </button>
//                 </div>
//             </div>
//         </header>
//     )
// }


"use client"

import { Menu, Bell, Search, X, Home } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
    onToggleSidebar: () => void
    onNotificationsClick: () => void
    showNotifications: boolean
}

export default function Header({ onToggleSidebar, onNotificationsClick, showNotifications }: HeaderProps) {
    const notifications = [
        { id: 1, message: "New user registered", time: "5 min ago" },
        { id: 2, message: "Revenue target reached", time: "1 hour ago" },
        { id: 3, message: "System update completed", time: "3 hours ago" },
        { id: 4, message: "New comment on post", time: "1 day ago" },
    ]

    return (
        <header className="border-b border-border bg-card backdrop-blur-md sticky top-0 z-40 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button onClick={onToggleSidebar} className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden">
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center gap-2 bg-muted/40 px-4 py-2 rounded-lg border border-border hover:border-primary/30 transition-colors">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-40"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4 relative">
                    {/* Notifications */}
                    <button
                        onClick={onNotificationsClick}
                        className="p-2 hover:bg-muted rounded-lg transition-colors relative group"
                    >
                        <Bell className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 animate-fade-in">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                                <h3 className="font-semibold text-foreground">Notifications</h3>
                                <button onClick={onNotificationsClick} className="p-1 hover:bg-muted rounded">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className="px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                                    >
                                        <p className="text-sm text-foreground">{notif.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-3 text-center border-t border-border">
                                <button className="text-sm text-primary hover:underline font-medium">View all notifications</button>
                            </div>
                        </div>
                    )}

                    {/* Profile */}
                    {/* <button className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
                        <div className="w-8 h-8 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-primary-foreground" />
                        </div>
                    </button> */}

                    <button className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
                        <div className="w-8 h-8 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center">
                            <Link href={"/"}>
                                <Home className="w-4 h-4 text-primary-foreground" />
                            </Link>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    )
}
