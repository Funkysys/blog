"use client";

import { useComments } from "@/hook/useComments";
import { CommentWithUser } from "@/types";
import { Comment } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { SyntheticEvent, useState } from "react";
import { useMutation } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

function Comments({ postSlug }: { postSlug: string }) {
  const { status } = useSession();
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

      {/* List of comments */}
      <>
        {isFetching ? (
          <p>Loading comments...</p>
        ) : (
          comments.map((comment: CommentWithUser) => (
            <div className="flex items-center mt-4" key={comment.id}>
              <Avatar>
                <AvatarImage
                  src={comment.user.image || "/img/shadcn_avatar.jpg"}
                  alt=""
                />
                <AvatarFallback>{comment.user.name}</AvatarFallback>
              </Avatar>

              <div className="ml-3 p-4 border border-slate-400 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{comment.user.name}</span>
                  <span className="text-sm text-slate-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="mt-2">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </>
    </div>
  );
}

export default Comments;
