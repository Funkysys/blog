import ArticlesListComponent from "@/components/LandingPage/ArticlesListComponent";
import CategoriesComponent from "@/components/LandingPage/CategoriesComponent";
import HomeComponent from "@/components/LandingPage/HomeComponent";
import type { Metadata } from "next";
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
export default function Home() {
  return (
    <main className=" flex-grow md:py-10 px-4 ">
      <section className="h-[70vh] md:h-[80vh] pt-14">
        <HomeComponent />
      </section>
      <section>
        <CategoriesComponent />
      </section>
      <section className="md:min-h-[100vh] ">
        <ArticlesListComponent slug={""} />
      </section>
    </main>
  );
}
