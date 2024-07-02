"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { BounceLoader } from "react-spinners";
const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="h-[90vh] flex flx-col item-center justify-center">
        <BounceLoader color="#36d7b7" />
      </div>
    );
  }
  if (status === "unauthenticated") {
    return (
      <div className="h-[90vh] w-[100vw] flex flex-col item-center justify-center items-center">
        <h1>You are not authenticated</h1>
        <Button variant="outline" onClick={() => signIn()}>
          Sign In
        </Button>
      </div>
    );
  }
  if (status === "authenticated") {
    return <>{children}</>;
  }
  return;
};
export default Layout;
