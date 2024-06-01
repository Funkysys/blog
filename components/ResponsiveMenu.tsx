"use client";
import { useCategories } from "@/hook/useCategories";
import { Category } from "@/types";
import { Menu } from "lucide-react";
import Link from "next/link";
import ProfileButton from "./ProfileButton";
import ToggleTheme from "./ToggleTheme";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const ResponsiveMenu = () => {
  const { data: categories, isLoading, isError } = useCategories();
  if (isError) {
    return (
      <Sheet>
        <SheetTrigger>
          <Menu className="h-6 w-6 md:hidden" />
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col gap-4 pl-5 ">
            <ProfileButton />
            <ToggleTheme />
          </div>
          <div className="flex flex-col gap-4">
            <Link href={"/write"}>
              <Button variant={"ghost"}>Add an album</Button>
            </Link>
            <p>Categories</p>
            <h3>Something went wrong... sorry !</h3>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="h-6 w-6 md:hidden" />
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col gap-4 pl-5 ">
          <ProfileButton />
          <ToggleTheme />
        </div>
        <div className="flex flex-col gap-4">
          <Link href={"/write"}>
            <Button variant={"ghost"}>Add an album</Button>
          </Link>
          <p>Categories</p>
          {!isLoading &&
            categories?.map((category: Category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="block px-2 py-1 text-lg"
              >
                <Button variant={"ghost"}>{category.title}</Button>
              </Link>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ResponsiveMenu;
