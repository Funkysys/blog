"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useCategories } from "@/hook/useCategories";
import { cn } from "@/lib/utils";
import { Category, User } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import * as React from "react";
import { UpdateRoleModale } from "./UpdateRoleModale";
import { Button } from "./ui/button";

export function HeaderNavigation() {
  const { data: session, status } = useSession();
  const { data: categories } = useCategories();
  const [link, setLink] = React.useState<string>("");
  const [changeRole, setChangeRole] = React.useState<Boolean>(false);
  const [buttonRole, SetButtonRole] = React.useState(false);
  const [user, setUser] = React.useState<User>();

  const fetchUser = async () => {
    const { data } = await axios.get(`/api/user/${session?.user?.email}`);
    setUser(data);
  };
  if (status === "authenticated" && !user) {
    fetchUser();
  }

  if (user?.role === "USER" && !buttonRole) {
    SetButtonRole(true);
  }
  if (
    (user?.role === "EDITOR" ||
      user?.role === "MODERATOR" ||
      user?.role === "ADMIN") &&
    link !== "/write"
  ) {
    SetButtonRole(false);
    setLink("/write");
  }
  if (
    (!user || status === "unauthenticated" || !session) &&
    link !== "/login"
  ) {
    setLink("/login");
  }

  return (
    <>
      {changeRole && user && <UpdateRoleModale changeRole={setChangeRole} />}
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>categories</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {categories?.map((category: Category) => (
                  <ListItem
                    key={category.id}
                    title={category.title}
                    href={`/categories/${category.slug}`}
                  >
                    {category.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            {!buttonRole && link !== "" && (
              <Link href={link} className={navigationMenuTriggerStyle()}>
                Add an album
              </Link>
            )}
            {buttonRole && (
              <Button
                variant="outline"
                className="bg-blue-600"
                onClick={() => setChangeRole(true)}
              >
                Become a contributor
              </Button>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
