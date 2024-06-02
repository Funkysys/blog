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
          <Avatar>
            <AvatarImage src={session?.user?.image || "/img/morty.jpg"} />
            <AvatarFallback>{session?.user?.name}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
            <Button
              variant="ghost"
              className="bg-blue-400 text-black hover:bg-blue-800"
            >
              Log Out
            </Button>
          </DropdownMenuItem>
          {(user?.role === "ADMIN" || user?.role === "MODERATOR") && (
            <DropdownMenuItem
              onClick={() => router.push("/moderator/category")}
              className="cursor-pointer"
            >
              <Button
                variant="ghost"
                className="bg-lime-600 text-black hover:bg-lime-800"
              >
                Create Category
              </Button>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => setChangeRole(true)}
            className="cursor-pointer"
          >
            <Button
              variant="ghost"
              className="bg-amber-400 text-black hover:bg-amber-800"
            >
              Change Role
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDelete(true)}
            className="cursor-pointer"
          >
            <Button variant="ghost" className="bg-red-600">
              Delete Account
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileButton;
