import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Header from "@/components/Header";
import ThemeProviders from "@/providers/ThemeProviders";
import Footer from "@/components/Footer";
import QueryProvider from "@/providers/query-provider";
import AuthProvider from "@/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className={`${inter.className} flex flex-col flex-between min-h-screen mx-auto w-full md:w-[70%]`}>
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
