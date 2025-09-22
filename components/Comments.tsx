"use client";

import { deleteComment } from "@/app/api/comments/deleteComment.action";
import { useComments } from "@/hook/useComments";
import { CommentWithUser } from "@/types";
import { Comment } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { SyntheticEvent, useState } from "react";
import { useMutation } from "react-query";
import { BounceLoader } from "react-spinners";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

type CommentProps = {
  postSlug: string;
  role: string;
};

function Comments({ postSlug, role }: CommentProps) {
  const { data: session, status } = useSession();
  const [content, setContent] = useState("");

  const createComment = (newComment: Partial<Comment>) => {
    return axios.post("/api/comments", newComment).then((res) => res.data);
  };

  const { mutate, isLoading } = useMutation(createComment, {
    onSuccess: (data: Comment) => {
      return refetch();
    },
  });

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    mutate({ content, postSlug });
    setContent("");
  };

  const handleOnDeleteComment = async (id: string) => {
    const commentDeleted = await deleteComment(id);
    if (commentDeleted) refetch();
  };
  const { data: comments, isFetching, refetch } = useComments(postSlug);

  return (
    <div className="mt-10">
      <Separator />
      <h2 className="text-2xl text-slate-500 font-semibold mt-4">Comments</h2>
      {/* Formulaire */}
      <div className="mt-2 mb-6">
        {status === "authenticated" ? (
          <div className="">
            <Textarea
              placeholder="Write a comment..."
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
            <Button
              disabled={content === "" || isLoading}
              className="mt-4"
              onClick={onSubmit}
            >
              {isLoading ? "Adding your comment" : "Add your comment"}
            </Button>
          </div>
        ) : (
          <Link href="/login" className="underline">
            Login to write a comment
          </Link>
        )}
      </div>

      <>
        {isFetching ? (
          <div className="h-[90vh] flex flx-col item-center justify-center">
            <BounceLoader color="#36d7b7" />
          </div>
        ) : (
          comments.map((comment: CommentWithUser) => (
            <>
              {console.log(
                comment?.User.email === session?.user?.email ||
                  role === "ADMIN" ||
                  role === "MODERATOR"
              )}
              <div className="flex items-center mt-4" key={comment.id}>
                <Avatar>
                  <AvatarImage
                    src={comment.User.image || "/img/shadcn_avatar.jpg"}
                    alt=""
                  />
                  <AvatarFallback>{comment.User.name}</AvatarFallback>
                </Avatar>

                <div className="ml-3 p-4 border border-slate-400 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{comment.User.name}</span>
                    <span className="text-sm text-slate-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    {(comment?.User.email === session?.user?.email ||
                      role === "ADMIN" ||
                      role === "MODERATOR") && (
                      <>
                        <Button
                          variant={"outline"}
                          className=" bg-red-500 text-white"
                          onClick={() => handleOnDeleteComment(comment.id)}
                        >
                          X
                        </Button>
                      </>
                    )}
                  </div>

                  <p className="mt-2">{comment.content}</p>
                </div>
              </div>
            </>
          ))
        )}
      </>
    </div>
  );
}

export default Comments;
