import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Separator } from "@/components/ui/separator";
import { Disc } from "lucide-react";


const HomeComponent = () => {
  return (
    <section
      style={{ backgroundImage: "url(/img/disque.jpg)" }}
      className="rounded-full w-[90%] md:w-[50%] m-auto aspect-square md:aspect-[1/1] overflow-hidden bg-cover"
    >
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="sm:max-w-xl max-w-xs bg-secondary/80 p-4 rounded-lg">
        <div className='flex justify-center items-center'>
            <Disc className='w-[20%] h-[20%] md:w-[50%] h-[50%] mr-2 rounded-full bg-gradient-to-br from-yellow-900 to-green-300
            '/>
            <h1
                className='text-center font-bold text-3xl sm:text-5xl 
            text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-green-300
            '
            >DiscoPhiles</h1>
        </div>
          <Input
            type="email"
            placeholder="email"
            className="dark:bg-white mt-5"
          />
          <Button
            size="lg"
            className="w-full py-6 text-xl mt-4"
          >
            Subscribe to our newsletter
          </Button>
        </div>
      </div>
      <Separator />
    </section>
  )
}

export default HomeComponent