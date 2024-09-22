"use client";

import { useRouter } from "next/navigation";
import FirstTitle from "./FirstTitle";
import { HeaderNavigation } from "./HeaderNavigation";
import { Button } from "./ui/button";

const Footer = () => {
  const router = useRouter();
  return (
    <footer className="p-4 border-t">
      <div className="w-full h-20vh bg-blue-950 text-slate-900 rounded-md flex justify-center p-4">
        <Button
          variant="outline"
          className="bg-amber-400"
          onClick={() =>
            router.push(
              "https://www.paypal.com/donate?hosted_button_id=64QKCN79A994E"
            )
          }
        >
          Support us on paypal
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <FirstTitle />
        <div className="flex items-center justify-center m-5 p-5 w-full">
          <HeaderNavigation />
        </div>
        <Button variant="ghost" onClick={() => router.push("/legals")}>
          Contact
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
