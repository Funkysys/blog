import { Separator } from "@/components/ui/separator";
import { SubscriptionsEmail } from "@/emails/index";
import { resend } from "@/lib/resend";
import { Disc } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const HomeComponent = () => {
  return (
    <div
      style={{ backgroundImage: "url(/img/disque.jpg)" }}
      className="rounded-full w-[90%] md:w-[50%] m-auto aspect-square md:aspect-[1/1] overflow-hidden bg-cover"
    >
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="absolute w-96 h-96 bg-slate-600/80 dark:bg-slate-800/80 p-4 rounded-full flex flex-col justify-center items-center">
          <div className="relative flex justify-center items-center">
            <Disc
              className=" mr-2 rounded-full bg-gradient-to-br from-yellow-900 to-green-300 text-white border-2 border-gray-400
            "
            />
            <h1
              className="text-center font-bold text-3xl md:text-5xl 
            text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-green-300
            "
            >
              DiscoPhiles
            </h1>
          </div>
          <form
            action={async (formData) => {
              "use server";
              const email = formData.get("email") as string;
              console.log(formData);

              await resend.emails.send({
                from: "http://localhost:3000",
                to: email,
                subject: "Welcome to DiscoPhiles",
                react: SubscriptionsEmail({
                  subscriptions: "http://localhost:3000",
                }),
              });
            }}
          >
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
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default HomeComponent;
