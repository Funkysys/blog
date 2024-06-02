"use client";

import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";

const Login = () => {
  const onLogin = (provider: string) => () => {
    signIn(provider, { callbackUrl: "/" });
  };
  return (
    <main className="flex flex-col flex-grow gap-10 justify-center items-center px-4">
      <PageTitle title="Welcome ! Login ?" />
      <section className="flex flex-col gap-4">
        <Button onClick={onLogin("discord")}>
          <div className="w-7 h-7 mr-3 aspect-square relative ">
            <Image alt="discord icon" src={"/icons/discord.svg"} fill />
          </div>
          Sign In With Discord
        </Button>
        <Button onClick={onLogin("google")}>
          <Mail className="mr-3" />
          Sign In With Google
        </Button>
      </section>
    </main>
  );
};
export default Login;
