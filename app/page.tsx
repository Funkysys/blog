import ArticlesListComponent from "@/components/LandingPage/ArticlesListComponent";
import CategoriesComponent from "@/components/LandingPage/CategoriesComponent";
import HomeComponent from "@/components/LandingPage/HomeComponent";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

export default function Home() {
  return (
    <main className=" flex-grow py-10 px-4 ">
      <section className="h-[100vh] pt-14">
        <HomeComponent />
      </section>
      <section className=" ">
        <CategoriesComponent />
      </section>
      <section className="md:min-h-[100vh] ">
        <ArticlesListComponent slug={""} />
      </section>
    </main>
  );
}
