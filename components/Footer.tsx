"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import FirstTitle from "./FirstTitle";
import { HeaderNavigation } from "./HeaderNavigation";
import { Button } from "./ui/button";

const Footer = () => {
  const router = useRouter();
  return (
    <footer className="p-4 border-t">
      <div className="w-full h-20vh bg-indigo-950 text-slate-900 rounded-md flex flex-col items-center justify-center p-4">
        <div>
          <p className="text-center text-slate-200 mb-4">
            Since all our applications are free and we strive to provide you
            with ever more efficient and secure tools, we invite you to support
            us in our efforts through a donation in the form of your choice.
            Thank you!
          </p>
        </div>
        <Button
          variant="outline"
          className="bg-amber-400"
          onClick={() =>
            router.push("https://www.paypal.com/ncp/payment/5T7NURZWCMEAA")
          }
        >
          Support us on paypal
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <FirstTitle />
        <div className="flex items-center justify-center m-5 p-5 w-full">
          <HeaderNavigation />
          <Link href="https://in-extremis-formation.fr" target="_blank">
            <Button variant="ghost" className="ml-4">
              In-Extremis-Formation
            </Button>
          </Link>
        </div>
        <Button variant="ghost" onClick={() => router.push("/legals")}>
          Contact
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
