"use client"

import PageTitle from "@/components/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
// import { POSTS } from "@/utils/posts";
import { Eye, MessageCircle } from "lucide-react";
import { usePost } from "@/hook/usePost"
// import { Post } from "@/utils/types"

type Props = {
    params: {
        slug: string;
    }
}

const PostsPage = ({ params }: Props) => {
    const { slug } = params;

    const { data: post, isFetching, error } = usePost(slug);

    if (isFetching) return <p>Loading...</p>
    if (error) return <p>error !</p>
    return (
        post ?
            <main className='flex flex-col flex-grow justify-center py-10 px-4'>
                <section
                    key={post.id}
                >
                    <PageTitle title={post.title} />
                    <div
                        className="rounded-full border-2 border-gray-500 aspect-square md:aspect-[1/1] overflow-hidden bg-cover w-[30%] m-auto p-6"
                        style={{ backgroundImage: "url(/img/duology.jpeg)" }}
                    />


                </section>
                <section className="flex justify-between items-center p-5 ">
                    <div className="flex justify-center items-center gap-3 mt-5">
                        <Avatar >
                            <AvatarImage src="/img/morty.jpeg" />
                            <AvatarFallback>{post.userEmail}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{post.userEmail}</p>
                            <p className="text-slate-500 text-sm">Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center pt-4">
                        <div className="flex gap-2">
                            <div className="flex gap-1 items-center"></div>
                            <MessageCircle size={24} />
                            <p >{post.nbComments}</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex gap-1 items-center"></div>
                            <Eye size={24} />
                            <p >{post.nbView}</p>
                        </div>
                    </div>
                </section>
                <Separator />
                <section className="mt-10">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: post.content as string || ""
                        }}
                    ></div>
                </section>
            </main>
            :
            <div className='flex flex-col flex-grow justify-center py-10 px-4'>
                        <h2>No Albums anyway</h2>
            </div>
    )
}

export default PostsPage