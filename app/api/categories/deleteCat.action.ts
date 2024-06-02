"use server";

import prisma from "@/lib/connect";

export const deleteCategory = async (id: string) => {
  const cat = await prisma.category.delete({
    where: { id },
  });
  return cat;
};
