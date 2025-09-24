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
      className={`group flex flex-col justify-between rounded-2xl border border-slate-500 bg-gradient-to-tr from-slate-900 to-sky-800 shadow-lg m-2 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl ${
        pathname.includes("categories") ? "max-h-[60vh]" : "md:max-h-[80vh]"
      }`}
    >
      <Link href={`/posts/${post.slug}`}>
        <CardHeader className="flex flex-col items-center gap-4 pt-6 pb-2">
          <div className="relative w-[80%] aspect-square mx-auto mb-2 flex items-center justify-center">
            <Image
              src={post.image ? `${post.image}` : "/img/disque.jpg"}
              alt={post?.title}
              fill
              onError={(e) => (e.currentTarget.src = "/img/disque.jpg")}
              className="object-cover rounded-full border-4 border-indigo-400 shadow-xl transition-all duration-300 group-hover:shadow-indigo-500 group-hover:scale-105"
              style={{
                background:
                  "radial-gradient(circle, #232e4d 60%, #1e293b 100%)",
              }}
            />
          </div>
          <CardTitle className="font-bold text-xl text-indigo-100 text-center group-hover:text-amber-300 transition-colors">
            {post.title}
          </CardTitle>

          {post.User && (
            <div className="flex flex-col items-center gap-1 mb-2">
              <Image
                src={post.User.image || "/img/default-avatar.png"}
                alt={post.User.name || "Author"}
                width={48}
                height={48}
                className="rounded-full border-2 border-indigo-200 shadow"
              />
              <span className="text-xs px-2 py-1 rounded bg-indigo-200 text-indigo-900 font-semibold mt-1">
                {post.User.name}
              </span>
            </div>
          )}

          <p
            className="text-sm text-slate-300 text-center px-2"
            dangerouslySetInnerHTML={{
              __html: (post.content as string)
                ? post.content.substring(0, 120) + "..."
                : "",
            }}
          />
        </CardHeader>
      </Link>
      <CardContent className="flex justify-center mt-2 mb-2">
        <Link href={`/categories/${post.catSlug}`}>
          <Badge
            variant="default"
            className="bg-amber-400 text-indigo-900 px-4 py-2 rounded-full shadow text-base"
          >
            {post.catSlug}
          </Badge>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between items-center px-6 py-4">
        <Link href={`/posts/${post.slug}`}>
          <Button className="bg-amber-400 hover:bg-amber-500 text-indigo-900 font-bold shadow px-6 py-2 text-base rounded-lg">
            Découvrir
          </Button>
        </Link>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1 bg-slate-800 rounded-full px-3 py-2 text-sm text-slate-200 shadow">
            <MessageCircle size={20} className="text-amber-400" />
            {post.nbComments}
          </span>
          <span className="flex items-center gap-1 bg-slate-800 rounded-full px-3 py-2 text-sm text-slate-200 shadow">
            <Eye size={20} className="text-amber-400" />
            {post.nbView}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Article;
