"use client";

import Comments from "@/components/Comments";
import { DeleteButton } from "@/components/DeleteButton";
import PageTitle from "@/components/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePost } from "@/hook/usePost";
import { Eye, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Props = {
  params: {
    slug: string;
  };
};

const PostsPage = ({ params }: Props) => {
  const { data: session } = useSession();
  const { slug } = params;

  const { data: post, isFetching, error } = usePost(slug);

  const releaseDate = post ? new Date(post.release).toLocaleDateString() : "";

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return post ? (
    <main className="flex flex-col flex-grow justify-center py-10 px-4">
      <section key={post.id} className="w-full">
        <div className="flex justify-center items-center m-auto mb-10 mt-3 gap-4">
          <PageTitle title={post.title} />
          {session && session.user?.email === post.userEmail && (
            <DeleteButton id={post.id} />
          )}
        </div>
        {post.image ? (
          <div
            className="rounded-full border-2 border-gray-500 aspect-square md:aspect-[1/1] overflow-hidden bg-cover w-[30%] m-auto p-6"
            style={{ backgroundImage: `url(${post.image})` }}
          />
        ) : (
          <div
            className="rounded-full border-2 border-gray-500 aspect-square md:aspect-[1/1] overflow-hidden bg-cover w-[30%] m-auto p-6"
            style={{ backgroundImage: `url(/img/img.jpg)` }}
          />
        )}
      </section>
      <section className="flex justify-between items-center p-5 mb-5 ">
        <div className="flex justify-center items-center gap-3 mt-5">
          <Avatar>
            <AvatarImage src={post.userImage} />
            <AvatarFallback>
              {post.userName ? post.userName : post.userEmail}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{post.userName ? post.userName : post.userEmail}</p>
            <p className="text-slate-500 text-sm">
              Posted on {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center pt-4">
          <div className="flex gap-2">
            <div className="flex gap-1 items-center"></div>
            <MessageCircle size={24} />
            <p>{post.nbComments}</p>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1 items-center"></div>
            <Eye size={24} />
            <p>{post.nbView}</p>
          </div>
        </div>
      </section>
      <Separator />
      <section className="mt-10 dark:text-slate-200">
        <h3 className="dark:text-slate-300">
          Artistes/Band: <span className="text-slate-200">{post.artist}</span>
        </h3>
        <div className="mt-3">
          <div className="flex gap-2">
            <h3>Team: </h3>
            <div>
              {post.team.map((member) => (
                <p key={member}>{member}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex gap-2">
            <h3>Tracks: </h3>
            <div>
              {post?.trackList?.map(
                (track) =>
                  track && (
                    <div key={track.id} className="flex gap-3">
                      <p> - {track.number} -</p>
                      <p>{track.name}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex gap-2">
            <h3>Links: </h3>
            <div className="flex flex-col gap-2">
              {post?.links?.map(
                (track) =>
                  track && (
                    <Link
                      key={track.id}
                      href={track.url}
                      className="text-blue-400 hover:underline"
                    >
                      {track.name}
                    </Link>
                  )
              )}
            </div>
          </div>
        </div>
        <div>
          <h3 className="mt-5">Release: {releaseDate}</h3>
        </div>
        <Link href={post.catSlug}>
          category :{" "}
          <Button variant={"outline"} className="my-5 dark:text-slate-50">
            {post.catTitle}
          </Button>
        </Link>
        <div className="border-2 border-slate-100 rounded-lg p-4">
          <h3 className="underline italic">Why this album :</h3>
          <div
            className="mt-5 dark:text-slate-300 text-sm"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </div>
        <Comments postSlug={slug} />
      </section>
    </main>
  ) : (
    <div className="flex flex-col flex-grow justify-center py-10 px-4">
      <h2>No Albums anyway</h2>
    </div>
  );
};

export default PostsPage;
