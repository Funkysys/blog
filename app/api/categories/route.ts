// /api/categories

// import { Category } from "@/utils/types";
import { getAuthSession } from "@/lib/auth-options";
import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

// GET POST PUT
export const GET = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong !" },
      { status: 500 }
    );
  }
  // get all categories
  // res.json({ categories: [] })
};
export const POST = async (req: Request, res: Response) => {
  // create a category
  try {
    const session = await getAuthSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "You are not authorized" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const { title, slug } = body;
    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }
    const category = await prisma.category.create({
      data: {
        title,
        slug,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong !" },
      { status: 500 }
    );
  }
};
