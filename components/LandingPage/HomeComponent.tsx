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
        <div className="absolute w-96 h-96 bg-slate-600/80 dark:bg-slate-800/80 p-4 rounded-full flex flex-col justify-center items-center">
          <div className='relative flex justify-center items-center'>
            <Disc className=' mr-2 rounded-full bg-gradient-to-br from-yellow-900 to-green-300 text-white border-2 border-gray-400
            '/>
            <h1
              className='text-center font-bold text-3xl md:text-5xl 
            text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-green-300
            '
            >DiscoPhiles</h1>
          </div>
          <div>

            <Input
              type="email"
              placeholder="email"
              className="dark:bg-white mt-5"
            />
            <Button
              size="lg"
              className="bg-red-800 dark:bg-amber-300 w-full py-6 text-xl mt-4"
            >
              Subscribe to our newsletter
            </Button>
          </div>
        </div>
      </div>
      <Separator />
    </section>
  )
}

export default HomeComponent