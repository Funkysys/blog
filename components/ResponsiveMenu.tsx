import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import Link from "next/link"
import { CATEGORIES } from "@/utils/categories"
import { Category } from "@/types"

const ResponsiveMenu = () => {
    return (
        <Sheet>
            <SheetTrigger>
                <Menu className="h-6 w-6 md:hidden" />
            </SheetTrigger>
            <SheetContent
                side="left"
                >
                <div
                className="flex flex-col gap-4"
                >
                    <Link href={'/new-post'}>
                        <Button variant={'ghost'}>Write A Post</Button>
                    </Link>
                    <p>Categories</p>
                    {CATEGORIES.map((category: Category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="block px-2 py-1 text-lg"
                        >
                            <Button variant={"ghost"}>
                                {category.title}
                            </Button>
                        </Link>
                    )
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default ResponsiveMenu