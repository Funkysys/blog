"use client";

import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BounceLoader } from "react-spinners";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  role: string;
  image: string;
};

const ProfileButton = () => {
  const [user, setUser] = useState<User>();
  const { data: session, status } = useSession();
  const router = useRouter();

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
    signOut();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={session?.user?.image || "/img/morty.jpg"} />
          <AvatarFallback>{session?.user?.name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          Log Out
        </DropdownMenuItem>
        {(user?.role === "ADMIN" ||
          user?.role === "MODERATOR" ||
          user?.role === "SUPERADMIN") && (
          <DropdownMenuItem
            onClick={() => router.push("/moderator/create-category")}
            className="cursor-pointer"
          >
            Create Category
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
