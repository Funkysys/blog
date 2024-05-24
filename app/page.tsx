import HomeComponent from "@/components/LandingPage/HomeComponent";
import CategoriesComponent from "@/components/LandingPage/CategoriesComponent";
import ArticlesListComponent from "@/components/LandingPage/ArticlesListComponent";

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

export default function Home() {
  
  
  return (
    <main className=" flex-grow py-10 px-4 ">
      <section className="h-[100vh] flex items-center">
        <HomeComponent />
      </section>
      <section className=" ">
        <CategoriesComponent />
      </section>
      <section className="md:h-[100vh] ">
        <ArticlesListComponent slug={""}/>
      </section>
    </main>
  );
}
