import { Input } from "../ui/input"
import { Button } from "../ui/button"

const HomeComponent = () => {
  return (
    <section
    style={{backgroundImage: "url(/img/img.jpg)"}}
    className="rounded-lg aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover"
    >
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="sm:max-w-xl max-w-xs bg-secondary/80 p-4 rounded-lg">
          <h1 className="text-center font-bold text-3xl sm:text-5xl text-black dark:text-white">
            Discophiles
          </h1>
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
    </section>  
    )
}

export default HomeComponent