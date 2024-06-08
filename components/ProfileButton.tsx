"use client";

import { User } from "@/types";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BounceLoader } from "react-spinners";
import { DeleteAccountModale } from "./DeleteAccountModale";
import { UpdateRoleModale } from "./UpdateRoleModale";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const ProfileButton = () => {
  const [user, setUser] = useState<User>();
  const [changeRole, setChangeRole] = useState<Boolean>(false);
  const [deleteAccount, setDelete] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleOnDeleteAccount = async () => {
    const deleteData = await axios.delete(`/api/user/${session?.user?.email}`);
    if (deleteData) signOut({ callbackUrl: "/" });
  };

  if (status === "unauthenticated") {
    return (
      <Link href={"/login"}>
        <Button variant="outline">Login</Button>
      </Link>
    );
  }
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

  const onLogout = () => {
    signOut({ callbackUrl: "/" });
  };
  return (
    <>
      {deleteAccount && (
        <DeleteAccountModale
          delete={setDelete}
          handleOnDeleteAccount={handleOnDeleteAccount}
        />
      )}
      {changeRole && user && <UpdateRoleModale changeRole={setChangeRole} />}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="w-12 h-12 rounded-full border-2 border-gray-400r">
            <AvatarImage src={session?.user?.image || "/img/morty.jpg"} />
            <AvatarFallback>{session?.user?.name}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={onLogout}
            className="fixed  cursor-pointer flex flex-col gap-6 w-[200px] bg-slate-600 hover:bg-slate-400 text-slate-100 p-4 rounded-md border-2 border-slate-300 z-50"
          >
            <Link href={"/write"} className="w-full">
              <Button
                className="bg-violet-600 hover:bg-violet-300 text-withe text-center text-slate-100 w-full"
                variant={"ghost"}
              >
                Add an album
              </Button>
            </Link>

            {(user?.role === "ADMIN" || user?.role === "MODERATOR") && (
              <Link href={"/moderator/category"} className="w-full">
                <Button
                  variant="ghost"
                  className="bg-lime-600 hover:bg-lime-300 text-slate-100 w-full"
                >
                  Create Category
                </Button>
              </Link>
            )}

            <Button
              onClick={() => setChangeRole(true)}
              variant="ghost"
              className="bg-amber-700 text-slate-100 hover:bg-amber-300 hover:text-slate-800 w-full"
            >
              Change Role
            </Button>
            <Button
              variant="ghost"
              className="bg-blue-800 hover:bg-blue-300 text-slate-100 w-full"
              onClick={() => signOut()}
            >
              Log Out
            </Button>
            <Button
              onClick={() => setDelete(true)}
              variant="ghost"
              className="bg-red-600 hover:bg-red-300 text-slate-50 w-full"
            >
              Delete Account
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileButton;
