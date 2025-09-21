import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ThemeProviders from "@/providers/ThemeProviders";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-quill/dist/quill.snow.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "discophiles-blog", template: "%s | discophiles-blog" },
  description: "Share your favorite albums and discover new ones",
  robots: "follow, index",
  icons: {
    icon: "/img/discophiles.png", // Chemin vers votre favicon
    shortcut: "/img/discophiles.png", // Chemin pour le raccourci
    apple: "/img/discophiles.png", // Favicon pour les appareils Apple
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
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var html = document.documentElement;
                if (theme === 'dark' || (!theme && systemDark)) {
                  html.classList.add('dark');
                  html.style.colorScheme = 'dark';
                } else {
                  html.classList.remove('dark');
                  html.style.colorScheme = 'light';
                }
              } catch(e) {}
            })();
          `,
        }}
      />
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
