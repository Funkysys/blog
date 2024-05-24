"use client";
import { useCategories } from "@/hook/useCategories";
import { Category } from "@/types";
import Link from "next/link";
import { Button } from "../ui/button";

const CategoriesComponent = () => {
  const { data: categories } = useCategories();
  return (
    <div className="gap-4 my-6 md:my-10 flex flex-col max-h-[30%] flex-wrap md:flex-row justify-center items-center border-t border-b py-4">
      {categories?.map((category: Category) => (
        <Link key={category.id} href={`/categories/${category.slug}`}>
          <Button variant="outline" className="py-4">
            {category.title}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default CategoriesComponent;
