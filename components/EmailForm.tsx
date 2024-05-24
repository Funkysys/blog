"use client";

import { emailSend } from "@/app/api/email/email.action";
import { Email } from "@prisma/client";
import axios from "axios";
import { FormEventHandler, useState } from "react";
import { useMutation } from "react-query";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const EmailForm = () => {
  const [email, setEmail] = useState("");
  const [emailIsSend, setEmailIsSend] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const [loader, setLoader] = useState(false);

  const createEmail = (newEmail: Partial<Email>) =>
    axios.post("/api/email", newEmail).then((res) => res.data);

  const {
    mutate,
    isLoading,
    data: mutateEmail,
  } = useMutation(createEmail, {
    onSuccess: (data: Email) => {
      console.log("Welcome to Discopholies !");
    },
  });

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const submitEmail: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(`/api/email/${email}`);
    setEmailExist(data ? true : false);

    if (emailExist) {
      return;
    }
    if (emailExist && email.length > 0) {
      try {
        const formData = new FormData(e.currentTarget);

        await mutate({
          email: email,
        });
        if (mutateEmail) {
          const res = await emailSend(formData);
          setEmailIsSend(true);
        }

        return;
      } catch (error) {
        console.error("Error in sendEmail : ", error);
      }
    }
  };

  if (emailIsSend)
    return (
      <div className="p-4 bg-gray-200 rounded-lg">
        <p className="text-green-800">
          Email send !!! Welcome to Discopholies !
        </p>
      </div>
    );
  if (emailExist)
    return (
      <div className="p-4 mt-2 bg-gray-200 rounded-lg">
        <p className="text-green-800">Email already exist...</p>
      </div>
    );
  if (isLoading)
    return (
      <div className="p-4 mt-2 bg-gray-200 rounded-lg">
        <p className="text-green-800">Something happens...</p>
      </div>
    );
  return (
    <form onSubmit={submitEmail}>
      <Input
        id="email"
        name="email"
        type="email"
        onChange={handleOnChange}
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
