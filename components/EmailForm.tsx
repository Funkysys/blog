"use client";

import { emailSend } from "@/app/api/email/email.action";
import { useEmails } from "@/hook/useEmail";
import { Email } from "@prisma/client";
import axios from "axios";
import { FormEventHandler, useState } from "react";
import { useMutation } from "react-query";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const EmailForm = () => {
  const [emailIsSend, setEmailIsSend] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const { data } = useEmails();
  const createEmail = (newEmail: Partial<Email>) =>
    axios.post("/api/email", newEmail).then((res) => res.data);
  const { mutate, isLoading } = useMutation(createEmail, {
    onSuccess: (data: Email) => {
      console.log(data);
    },
  });

  const submitEmail: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      if (
        data?.find(
          (email: { email: string }) =>
            email.email === e.currentTarget.email.value
        )
      ) {
        return setEmailExist(true);
      }
      await mutate({
        email: e.currentTarget.email.value as string,
      });
      const res = await emailSend(formData);
      console.log(res);

      setEmailIsSend(true);
      return;
    } catch (error) {
      console.error("Error in uploadImage : ", error);
    }
  };
  if (emailExist)
    return (
      <div className="p-4 bg-gray-200 rounded-lg">
        <p className="text-green-800">Email already exist !!!</p>
      </div>
    );
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
