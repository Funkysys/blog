"use server";

import prisma from "@/lib/connect";

export const deleteComment = async (id: string) => {
  const comment = await prisma.comment.delete({
    where: { id },
  });
  return comment;
};
