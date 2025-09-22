"use client";
import { useCategories } from "@/hook/useCategories";
import { Category } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

const CategoriesComponent = () => {
  const { data: categories } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

  if (!categories || categories.length === 0) return null;

  return (
    <>
      {/* Version Desktop - Affichage horizontal classique */}
      <div className="hidden sm:flex md:gap-4 md:my-10 md:max-h-[30%] md:flex-wrap md:flex-row md:justify-center md:items-center md:border-t md:border-b pt-4 pb-2">
        {categories.map((category: Category) => (
          <Link
            key={category.id}
            className="mr-2 mb-2"
            href={`/categories/${category.slug}`}
          >
            <Button variant="outline" className="py-2 px-4">
              {category.title}
            </Button>
          </Link>
        ))}
      </div>

      {/* Version Mobile - Menu déroulant compact */}
      <div className="sm:hidden px-4 py-2 border-t border-b">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center py-3"
        >
          <span>Catégories</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 " />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {isOpen && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {categories.map((category: Category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start py-2 h-auto border-b-2 border-b-gray-300"
                >
                  {category.title}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoriesComponent;
