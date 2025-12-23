import type React from "react"
import type { Metadata } from "next"
import { Recursive } from "next/font/google";
import "./globals.css"
import { Suspense } from "react"
import SessionWrapper from "@/components/SessionWrapper"
import { CartProvider } from "@/lib/cart_context"
import { Toaster } from "@/components/ui/sonner";
import Loading from "./loading"

const recursive = Recursive({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "speed cars",
  description: "Created With Nextjs",
  generator: "test",
  icons: [
    {
      url: "/cars/bmw_m5_competition_1.png",
    },]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionWrapper>
      <html lang="en" className={recursive.className} suppressHydrationWarning>
        <body>
          <CartProvider>
            <main className="flex flex-col min-h-[calc(100vh-3.5rem-1px)]">
              <Suspense fallback={<Loading />}>
                {/* <Toaster richColors position="bottom-right" /> */}
                {children}
                <Toaster position="bottom-right" richColors={true} />
              </Suspense>
            </main>
          </CartProvider>
        </body>
      </html>
    </SessionWrapper>
  )
}
