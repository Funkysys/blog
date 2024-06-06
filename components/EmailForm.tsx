"use client";

import { emailSend } from "@/app/api/email/email.action";
import { Email } from "@prisma/client";
import axios from "axios";
import { FormEventHandler, useState } from "react";
import { useMutation } from "react-query";
import { BounceLoader } from "react-spinners";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const EmailForm = () => {
  const [email, setEmail] = useState("");
  const [emailIsSend, setEmailIsSend] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(new FormData());

  const createEmail = (newEmail: Partial<Email>) =>
    axios.post("/api/email", newEmail).then((res) => res.data);

  const {
    mutate,
    isLoading,
    data: mutateEmail,
  } = useMutation(createEmail, {
    onSuccess: (data: Email) => {
      const sendingEmail = async () => {
        const res = await emailSend(formData);
        res && setEmailIsSend(true);
        console.log("Welcome to Discopholies !");
      };
      sendingEmail();
      setLoader(false);
    },
    onError: (error) => {
      setLoader(false);
      setError(true);
      console.error("Error in createEmail : ", error);
    },
  });

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const submitEmail: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoader(true);
    setFormData(new FormData(e.currentTarget));
    const { data } = await axios.get(`/api/email/${email}`);
    await setEmailExist(data ? true : false);

    if (emailExist) {
      return;
    }
    if (!emailExist && email.length > 0) {
      try {
        await mutate({
          email: email,
        });
        if (mutateEmail) {
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
  if (loader)
    return (
      <div className="h-[90vh] flex flx-col item-center justify-center">
        <BounceLoader color="#36d7b7" />
      </div>
    );

  if (error)
    return (
      <div className="h-[90vh] flex flx-col item-center justify-center">
        <p className="text-red-800">Something went wrong... Sorry !</p>
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
