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
  description: "CouCou",
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
