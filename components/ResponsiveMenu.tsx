"use client";
import { useCategories } from "@/hook/useCategories";
import { User } from "@/types";
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
  const [openMenu, setOpenMenu] = useState(false);
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
            {status === "authenticated" && (
              <Link href={"/write"}>
                <Button variant={"ghost"}>Add an album</Button>
              </Link>
            )}
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
      <Sheet open={openMenu} onOpenChange={() => setOpenMenu(!openMenu)}>
        <SheetTrigger>
          <Menu className="h-6 w-6 md:hidden" />
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col gap-4 pl-5 mb-5">
            <ProfileButton />
            <ToggleTheme />
            {status === "loading" && <BounceLoader color="#36d7b7" />}
            {status === "authenticated" && (
              <Link href={"/write"}>
                <Button
                  className="bg-violet-600 hover:bg-violet-300 text-withe text-center text-slate-100 w-full"
                  variant={"ghost"}
                  onClick={() => setOpenMenu(false)}
                >
                  Add an album
                </Button>
              </Link>
            )}

            {(user?.role === "ADMIN" || user?.role === "MODERATOR") &&
              status === "authenticated" && (
                <Link href={"/moderator/category"} className="w-full">
                  <Button
                    variant="ghost"
                    className="bg-lime-600 hover:bg-lime-300 text-slate-100 w-full"
                    onClick={() => setOpenMenu(false)}
                  >
                    Create Category
                  </Button>
                </Link>
              )}
            {status === "authenticated" && (
              <>
                <Button
                  onClick={() => (setChangeRole(true), setOpenMenu(false))}
                  variant="ghost"
                  className="bg-amber-700 text-slate-100 hover:bg-amber-300 hover:text-slate-800 w-full"
                >
                  Change Role
                </Button>
                <Button
                  variant="ghost"
                  className="bg-blue-800 hover:bg-blue-300 text-slate-100"
                  onClick={() => (signOut(), setOpenMenu(false))}
                >
                  Log Out
                </Button>
                <Button
                  onClick={() => (setDelete(true), setOpenMenu(false))}
                  variant="ghost"
                  className="bg-red-600 hover:bg-red-300 text-slate-50 "
                >
                  Delete Account
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ResponsiveMenu;
