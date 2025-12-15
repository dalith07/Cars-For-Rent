// "use client"

// import { useState } from "react"
// import ChartsSection from "./charts-section"
// import ActivityFeed from "./activity-feed"
// import AnalyticsPage from "../pages/analytics"
// import UsersPage from "../pages/users"
// import OrdersPage from "../pages/orders"
// import CarsPage from "../pages/cars"
// import SettingsPage from "../pages/settings"
// import Sidebar from "./sidebar"
// import StatsGrid from "./stats-grid"
// import Header from "./header"


// export default function DashboardLayout() {
//     const [sidebarOpen, setSidebarOpen] = useState(true)
//     const [activePage, setActivePage] = useState("dashboard")
//     const [showNotifications, setShowNotifications] = useState(false)

//     return (
//         <div className="flex h-screen bg-linear-to-br from-background via-background to-primary/10 overflow-hidden">
//             <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-accent/10 pointer-events-none" />

//             {/* Sidebar */}
//             <Sidebar isOpen={sidebarOpen} activePage={activePage} onNavigate={setActivePage} />

//             {/* Main Content */}
//             <div className="flex-1 flex flex-col overflow-hidden relative z-10">
//                 {/* Header */}
//                 <Header
//                     onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//                     onNotificationsClick={() => setShowNotifications(!showNotifications)}
//                     showNotifications={showNotifications}
//                 />

//                 {/* Main Area */}
//                 <main className="flex-1 overflow-auto">
//                     <div className="p-6 lg:p-8 max-w-7xl mx-auto">
//                         {activePage === "dashboard" && (
//                             <>
//                                 {/* Welcome Section */}
//                                 <div className="mb-8 animate-fade-in">
//                                     <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
//                                     <p className="text-muted-foreground">Welcome back! {"Here's"} your performance overview.</p>
//                                 </div>

//                                 {/* Stats Grid */}
//                                 <StatsGrid />

//                                 {/* Charts Section */}
//                                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
//                                     <div className="lg:col-span-2">
//                                         <ChartsSection />
//                                     </div>
//                                     <ActivityFeed />
//                                 </div>
//                             </>
//                         )}

//                         {activePage === "analytics" && <AnalyticsPage />}
//                         {activePage === "users" && <UsersPage />}
//                         {activePage === "orders" && <OrdersPage />}
//                         {activePage === "cars" && <CarsPage />}
//                         {activePage === "settings" && <SettingsPage />}
//                     </div>
//                 </main>
//             </div>
//         </div>
//     )
// }


"use client"

import ChartsSection from "./charts-section"
import ActivityFeed from "./activity-feed"
import StatsGrid from "./stats-grid"

export default function DashboardClient() {

    return (
        <div className="flex h-screen bg-linear-to-br from-background via-background to-primary/10 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-accent/10 pointer-events-none" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* Welcome Section */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! {"Here's"} your performance overview.</p>
                </div>

                {/* Stats Grid */}
                <StatsGrid />

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-2">
                        <ChartsSection />
                    </div>
                    <ActivityFeed />
                </div>
            </div>
        </div>
    )
}
