import ArticlesListComponent from "@/components/LandingPage/ArticlesListComponent";
import CategoriesComponent from "@/components/LandingPage/CategoriesComponent";
import HomeComponent from "@/components/LandingPage/HomeComponent";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "discophiles-blog",
  description: "CouCou",
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
