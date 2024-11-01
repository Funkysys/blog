import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostWithCategory } from "@/types";
import { Eye, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "./ui/badge";

type Props = {
  post: PostWithCategory;
};

const Article = ({ post }: Props) => {
  const pathname = usePathname();
  return (
    <Card
      className={
        pathname.includes("categories")
          ? "flex flex-col items-between rounded-lg border-2 m-2  max-h-[50vh]"
          : "flex flex-col items-between rounded-lg border-2 m-2  md:max-h-[70vh]"
      }
    >
      <Link href={`/posts/${post.slug}`}>
        <CardHeader>
          <div className="aspect-square relative mb-2">
            <Image
              src={post.image ? `${post.image}` : "/img/disque.jpg"}
              alt={post?.title}
              fill
              className="aspect-square object-cover rounded-full border-2 shadow-sm shadow-slate-400 transition-all duration-300 hover:scale-110"
            />
          </div>
          <CardTitle className="font-semibold text-md">{post.title}</CardTitle>

          <p
            className="text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: (post.content as string)
                ? post.content.substring(0, 50)
                : "",
            }}
          />
        </CardHeader>
      </Link>
      <CardContent>
        <Link href={`/categories/${post.catSlug}`}>
          <Badge variant="outline">{post.catSlug}</Badge>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/posts/${post.slug}`}>
          <Button variant="outline">Discover</Button>
        </Link>
        <div className="flex gap-2">
          <div className="flex gap-1 items-center"></div>
          <MessageCircle size={20} className="text-slate-500" />
          <p className="text-slate-500">{post.nbComments}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 items-center"></div>
          <Eye size={20} className="text-slate-500" />
          <p className="text-slate-500">{post.nbView}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Article;
