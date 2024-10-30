"use server";

import prisma from "@/lib/connect";

export const addAllPosts = async () => {
  const post = await prisma.post.count();
  return post;
};
