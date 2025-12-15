import { notFound } from "next/navigation"
import { CartProvider } from "@/lib/cart_context"
import { Suspense } from "react"
import Loading from "../loading"
import { Toaster } from "@/components/ui/sonner"

const locales = ["en", "fr", "ar"]

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(params.locale)) {
    notFound()
  }

  return (
    <html
      lang={params.locale}
      dir={params.locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body>
        <CartProvider>
          <main className="flex flex-col min-h-[calc(100vh-3.5rem-1px)]">
            <Suspense fallback={<Loading />}>
              {children}
              <Toaster position="bottom-right" richColors />
            </Suspense>
          </main>
        </CartProvider>
      </body>
    </html>
  )
}
