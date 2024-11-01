"use client";
import { useCategories } from "@/hook/useCategories";
import { Category } from "@/types";
import Link from "next/link";
import { Button } from "../ui/button";

const CategoriesComponent = () => {
  const { data: categories } = useCategories();

  return (
    <div className="invisible sm:visible md:gap-4 md:my-10 md:max-h-[30%] md:flex-wrap md:flex-row md:justify-center md:items-center md:border-t md:border-b py-4">
      {categories?.map((category: Category) => (
        <Link
          key={category.id}
          className="mr-2"
          href={`/categories/${category.slug}`}
        >
          <Button variant="outline" className="py-4">
            {category.title}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default CategoriesComponent;
