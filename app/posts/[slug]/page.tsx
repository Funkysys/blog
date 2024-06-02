"use client";

import Comments from "@/components/Comments";
import { DeleteButton } from "@/components/DeleteButton";
import PageTitle from "@/components/PageTitle";
import { UpdateButton } from "@/components/UpdateButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePost } from "@/hook/usePost";
import axios from "axios";
import { Eye, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

type Props = {
  params: {
    slug: string;
  };
};

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  role: string;
  image: string;
};

const PostsPage = ({ params }: Props) => {
  const { data: session, status } = useSession();
  const { slug } = params;
  const [user, setUser] = useState<User>();
  const [role, setRole] = useState<string>("");
  const [right, setRight] = useState<Boolean>(false);
  const { data: post, isFetching, error } = usePost(slug);

  if (user && role === "") {
    setRole(user.role);
  }
  useEffect(() => {
    if (role === "ADMIN" || (role === "MODERATOR" && !right)) {
      setRight(true);
    } else if (post?.userEmail === session?.user?.email && !right) {
      setRight(true);
    }
  }, [role, right, post, session]);

  if (status === "unauthenticated") {
    return <p>Unauthenticated</p>;
  }

  if (status === "loading") {
    <BounceLoader color="#36d7b7" />;
  }

  const releaseDate = post ? new Date(post.release).toLocaleDateString() : "";

  if (status === "loading") {
    <BounceLoader color="#36d7b7" />;
  }
  const fetchUser = async () => {
    const { data } = await axios.get(`/api/user/${session?.user?.email}`);
    setUser(data);
  };

  if (!user) {
    fetchUser();
  }

  if (isFetching)
    return (
      <div className="h-[90vh] flex flx-col item-center justify-center">
        <BounceLoader color="#36d7b7" />
      </div>
    );
  if (error) return <p>Error!</p>;
  console.log(user?.role, post?.userEmail, session?.user?.email);

  return post ? (
    <main className="flex flex-col flex-grow justify-center py-10 px-4">
      <section key={post.id} className="w-full">
        <div className="flex justify-center items-center m-auto mb-10 mt-3 gap-4">
          <PageTitle title={post.title} />
          {right && (
            <>
              <DeleteButton id={post.id} />
              <UpdateButton slug={slug} />
            </>
          )}
        </div>
        <div className="relative rounded-full border-2 border-gray-500 aspect-square md:aspect-[1/1] overflow-hidden bg-cover w-[40%] m-auto">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              onError={(e) => (e.currentTarget.src = "/img/disque.jpg")}
              className="rounded-full  object-cover "
            />
          ) : (
            <Image
              src="/img/disque.jpg"
              alt={post.title}
              layout="responsive"
              fill
              className="rounded-full  object-cover "
            />
          )}
        </div>
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
