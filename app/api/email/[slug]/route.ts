import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  context: { params: { slug: string } }
) => {
  try {
    const { slug } = context.params;
    const user = await prisma.user.findUnique({
      where: {
        email: slug as string,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
