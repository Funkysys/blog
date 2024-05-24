import HomeComponent from "@/components/LandingPage/HomeComponent";
import CategoriesComponent from "@/components/LandingPage/CategoriesComponent";
import ArticlesListComponent from "@/components/LandingPage/ArticlesListComponent";

export default function Home() {
  
  
  return (
    <main className=" flex-grow py-10 px-4">
      <HomeComponent />
      <CategoriesComponent />
      <ArticlesListComponent slug={""}/>
    </main>
  );
}
