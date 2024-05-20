import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Post, PostWithCategory } from '@/types';
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Eye, MessageCircle } from "lucide-react";

type Props = {
    post: PostWithCategory;
}

const Article = ({ post }: Props) => {
    console.log(post.image);

    return (
        <Card className="flex flex-col justify-center items-between rounded-lg border-2 m-2 h-[100%] ">
            <Link href={`/posts/${post.slug}`}>
                <CardHeader>
                    <div className="aspect-square relative mb-2">
                        <Image
                            src={`${post.image}`}
                            alt={post?.title}
                            fill
                            className="aspect-square object-cover transition-all duration-300 hover:scale-110"
                        />
                    </div>
                    <CardTitle className="font-semibold text-md">{post.title}</CardTitle>
                    <CardDescription dangerouslySetInnerHTML={{
                            __html: post.content as string ? post.content.substring(0, 50) : ""
                        }}>{`...`}</CardDescription>
                </CardHeader>
            </Link>
            <CardContent>
                <Link href={`/categories/${post.catSlug}`}>
                    <Badge variant='outline'>
                        {post.catSlug}
                    </Badge>
                </Link>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Link href={`/posts/${post.slug}`}>
                    <Button
                        variant='outline'
                    >
                        Discover</Button>
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
    )
}

export default Article