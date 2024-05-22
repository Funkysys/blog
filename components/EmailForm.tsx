"use client";

import { emailSend } from "@/app/api/email/email.action";
import { FormEventHandler, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export type EmailFormProps = {};

export const EmailForm = (props: EmailFormProps) => {
  const [emailIsSend, setEmailIsSend] = useState(false);

  const submitEmail: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      console.log(formData);

      const res = await emailSend(formData);
      console.log(res);

      setEmailIsSend(true);
      return;
    } catch (error) {
      console.error("Error in uploadImage : ", error);
    }
  };
  console.log(emailIsSend);

  if (emailIsSend)
    return (
      <div className="p-4 bg-gray-200 rounded-lg">
        <p className="text-green-800">
          Email send !!! Welcome to Discopholies !
        </p>
      </div>
    );
  return (
    <form onSubmit={submitEmail}>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Your email..."
        className=" mt-5"
        required
      />
      <Button
        size="lg"
        className="bg-red-800 dark:bg-amber-300 w-full py-6 text-xl mt-4"
        type="submit"
      >
        Subscribe to our newsletter
      </Button>
    </form>
  );
};
