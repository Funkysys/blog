import { getAuthSession } from "@/lib/auth-options";
import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const catSlug = searchParams.get("cat");
    const page: number = Number(searchParams.get("page"));

    const count = await prisma.post.count({
      where: {
        ...(catSlug && catSlug !== "null" && catSlug !== "" && { catSlug }),
      },
    });

    const posts = await prisma.post.findMany({
      skip: page * 6,
      take: 6,
      where: {
        ...(catSlug && catSlug !== "null" && catSlug !== "" && { catSlug }),
      },

      include: {
        cat: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const postsAndCount = {
      posts,
      count,
    };

    return NextResponse.json(postsAndCount, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "You are not authorized" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const dataFromBody = {
      title: body.title,
      content: body.content,
      slug: body.slug,
      catSlug: body.catSlug,
      catTitle: body.catTitle,
      image: body.image,
      userEmail: session.user.email || "",
      userName: session.user.name || "",
      userImage: session.user.image || "",
      release: body.release,
      artist: body.artist,
      team: body.team,
      trackList: body.trackList,
      links: body.links,
    };

    const post = await prisma.post.create({
      data: {
        ...dataFromBody,
      },
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
