import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "react-quill/dist/quill.snow.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://discophiles-blog.eu"),
  title: { default: "discophiles-blog", template: "%s | discophiles-blog" },
  description: "Share your favorite albums and discover new ones",
  robots: "follow, index",
  icons: {
    icon: "/img/discophiles.png",
    shortcut: "/img/discophiles.png",
    apple: "/img/discophiles.png",
    other: [
      { rel: "mask-icon", url: "/img/discophiles.png", color: "#5bbad5" },
    ],
  },
  abstract: "Share your favorite albums and discover new ones",
  keywords: ["music", "albums", "discophiles", "blog", "reviews"],
  twitter: {
    card: "summary",
    site: "@discophiles-blog",
    title: "discophiles-blog",
    description: "Share your favorite albums and discover new ones",
    images: "/img/discophiles.png",
  },
  openGraph: {
    title: "discophiles-blog",
    description: "Share your favorite albums and discover new ones",
    images: "/img/discophiles.png",
    url: "https://discophiles-blog.eu",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
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
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Header />
              {children}
              <Footer />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
