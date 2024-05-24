"use server";

import prisma from "@/lib/connect";

export const deletePost = async (id: string) => {
  const post = await prisma.post.delete({
    where: { id },
  });
  console.log(post);
  return post;
};
