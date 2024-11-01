import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ThemeProviders from "@/providers/ThemeProviders";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "discophiles-blog", template: "%s | discophiles-blog" },
  description: "Share your favorite albums and discover new ones",
  robots: "follow, index",
  abstract: "Share your favorite albums and discover new ones",
  keywords: ["music", "albums", "discophiles", "blog", "reviews"],
  twitter: {
    card: "summary",
    site: "@discophiles-blog",
    title: "discophiles-blog",
    description: "Share your favorite albums and discover new ones",
    images: "/logo.png",
  },
  openGraph: {
    title: "discophiles-blog",
    description: "Share your favorite albums and discover new ones",
    images: "/logo.png",
    url: "https://discophiles-blog.eu",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col flex-between min-h-screen mx-auto w-full md:w-[70%] overscroll-hidden`}
      >
        <QueryProvider>
          <AuthProvider>
            <ThemeProviders
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              <Header />
              {children}
              <Footer />
            </ThemeProviders>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
