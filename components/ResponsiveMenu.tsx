"use client";
import { useCategories } from "@/hook/useCategories";
import { Category, User } from "@/types";
import axios from "axios";
import { Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { BounceLoader } from "react-spinners";
import { DeleteAccountModale } from "./DeleteAccountModale";
import ProfileButton from "./ProfileButton";
import ToggleTheme from "./ToggleTheme";
import { UpdateRoleModale } from "./UpdateRoleModale";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const ResponsiveMenu = () => {
  const { data: categories, isLoading, isError } = useCategories();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>();
  const [changeRole, setChangeRole] = useState<Boolean>(false);
  const [deleteAccount, setDelete] = useState(false);

  const handleOnDeleteAccount = async () => {
    const deleteData = await axios.delete(`/api/user/${session?.user?.email}`);
    if (deleteData) signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    <BounceLoader color="#36d7b7" />;
  }
  const fetchUser = async () => {
    const { data } = await axios.get(`/api/user/${session?.user?.email}`);
    setUser(data);
  };
  if (status === "authenticated" && !user) {
    fetchUser();
  }

  if (isError) {
    return (
      <Sheet>
        <SheetTrigger>
          <Menu className="h-6 w-6 md:hidden" />
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col gap-6 pl-5 ">
            {status === "unauthenticated" && (
              <Link href={"/login"}>
                <Button variant="outline">Login</Button>
              </Link>
            )}
            {status === "loading" && <BounceLoader color="#36d7b7" />}
            {status === "authenticated" && !user && <ProfileButton />}
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
    <>
      {deleteAccount && (
        <DeleteAccountModale
          delete={setDelete}
          handleOnDeleteAccount={handleOnDeleteAccount}
        />
      )}
      {changeRole && user && <UpdateRoleModale changeRole={setChangeRole} />}
      <Sheet>
        <SheetTrigger>
          <Menu className="h-6 w-6 md:hidden" />
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col gap-4 pl-5 mb-5">
            <ProfileButton />
            <ToggleTheme />
            <Button
              variant="ghost"
              className="bg-blue-400 text-black hover:bg-blue-800"
            >
              Log Out
            </Button>
            {(user?.role === "ADMIN" || user?.role === "MODERATOR") && (
              <Button
                variant="ghost"
                className="bg-lime-600 text-black hover:bg-lime-800"
              >
                Create Category
              </Button>
            )}
            <Button
              onClick={() => setChangeRole(true)}
              variant="ghost"
              className="bg-amber-400 text-black hover:bg-amber-800"
            >
              Change Role
            </Button>
            <Button
              onClick={() => setDelete(true)}
              variant="ghost"
              className="bg-red-600"
            >
              Delete Account
            </Button>
            <Link href={"/write"}>
              <Button
                className="bg-violet-600 text-withe text-center w-full"
                variant={"ghost"}
              >
                Add an album
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-4 w-full text-center">
            <p className=" underline text-lg">Categories</p>
            {!isLoading &&
              categories?.map((category: Category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="block px-2 py-1 text-lg"
                >
                  <Button className="bg-slate-700" variant={"ghost"}>
                    {category.title}
                  </Button>
                </Link>
              ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ResponsiveMenu;
