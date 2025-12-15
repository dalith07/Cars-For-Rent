"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"

export default function SettingsPage() {
    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your application settings and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="animate-scale-in">
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Basic application configuration</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-foreground">Dark Mode</p>
                                <p className="text-sm text-muted-foreground">Enable dark theme</p>
                            </div>
                            <Toggle />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-foreground">Email Notifications</p>
                                <p className="text-sm text-muted-foreground">Receive email alerts</p>
                            </div>
                            <Toggle />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-foreground">Auto Save</p>
                                <p className="text-sm text-muted-foreground">Automatically save changes</p>
                            </div>
                            <Toggle />
                        </div>
                    </CardContent>
                </Card>

                <Card className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Manage security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-foreground">Two-Factor Auth</p>
                                <p className="text-sm text-muted-foreground">Enable 2FA for extra security</p>
                            </div>
                            <Toggle />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-foreground">Login Alerts</p>
                                <p className="text-sm text-muted-foreground">Alert on new login</p>
                            </div>
                            <Toggle />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-foreground">API Keys</p>
                                <p className="text-sm text-muted-foreground">Manage API keys</p>
                            </div>
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                                Manage
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
