"use client";

import { useRouter } from "next/navigation";
import FirstTitle from "./FirstTitle";
import { HeaderNavigation } from "./HeaderNavigation";
import { Button } from "./ui/button";

const Footer = () => {
  const router = useRouter();
  return (
    <footer className="p-4 border-t">
      <div className="flex items-center justify-between">
        <FirstTitle />
        <div className="flex items-center justify-center m-5 p-5 w-full">
          <HeaderNavigation />
        </div>
        <Button
          variant="ghost"
          onClick={() => router.push("/mentions-legales")}
        >
          Contact
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
