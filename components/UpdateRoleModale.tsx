import { updateRole } from "@/app/api/user/updateRole.action";
import { User } from "@/types";
import { Role } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Select from "react-select";
import { Button } from "./ui/button";

export type UpdateRoleProps = {
  changeRole: (value: boolean) => void;
};

export const UpdateRoleModale = ({ changeRole }: UpdateRoleProps) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>();
  const [role, setRole] = useState<string>();
  const [moderator, setModerator] = useState<boolean>(false);
  const [result, setResult] = useState<boolean>(false);

  const fetchUser = async () => {
    const { data } = await axios.get(`/api/user/${session?.user?.email}`);
    setUser(data);
  };
  if (status === "authenticated" && !user) {
    fetchUser();
  }

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!role || !user) return;
    if (role === user?.role) return;
    if (role === "MODERATOR" || role === "ADMIN") {
      setModerator(true);
      return;
    }
    const result = await updateRole(user?.email, Role.MODERATOR);
    if (result) {
      setResult(true);
      setTimeout(() => {
        changeRole(false);
      }, 2000);
    }
  };

  const roleAndDescription = [
    { name: "USER", descr: "As a user, all you have to do is enjoy the site" },
    {
      name: "MODERATOR",
      descr:
        "As a moderator, you will be able to moderate content and manage posts",
    },
    {
      name: "ADMIN",
      descr:
        "As an administrator, you will be able to participate in the complete management of the site",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={(e) => handleOnSubmit(e)}
        className="bg-white p-4 rounded-lg flex flex-col gap-4 w-96 justify-center items-center"
      >
        <div className="w-full flex justify-end">
          <Button
            className="float-right bg-red-600"
            onClick={() => changeRole(false)}
            variant="outline"
          >
            X
          </Button>
        </div>
        <h2 className="text-lg font-bold text-black text-center">
          actually role: {user?.role}
        </h2>
        {result && (
          <div className="  bg-green-600 text-white p-2 rounded-lg">
            Role updated
          </div>
        )}
        {moderator && (
          <div className=" p-2 rounded-lg text-center">
            <p className="text-black ">
              If you want to change to moderator or admin role, send me an email
              to validate. In the email, please specify the reason for your
              choice.
            </p>
            <Link
              href="mailto:contact@discophiles-blog.eu"
              className="text-blue-600 hover:underline"
            >
              contact@discophiles-blog.eu
            </Link>
          </div>
        )}
        <Select
          className="mt-4 text-slate-800"
          options={[
            { value: "USER", label: "User" },
            { value: "EDITOR", label: "Editor" },
            { value: "MODERATOR", label: "Moderator" },
            { value: "ADMIN", label: "Admin" },
          ]}
          onChange={(e) => setRole(e?.value)}
        />
        {role && (
          <>
            {roleAndDescription.map(
              (roleAndDescription) =>
                roleAndDescription.name === role &&
                roleAndDescription.name !== user?.role && (
                  <p key={role} className="text-green-800">
                    selected role : {roleAndDescription.descr}
                  </p>
                )
            )}
            {roleAndDescription.map(
              (roleAndDescription) =>
                roleAndDescription.name === user?.role && (
                  <p key={role} className="text-red-800">
                    actual role : {roleAndDescription.descr}
                  </p>
                )
            )}
          </>
        )}

        <div className="flex gap-4 mt-4 w-full justify-center">
          <Button type="submit" variant="outline" className="bg-green-600">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};
