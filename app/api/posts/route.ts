import { getAuthSession } from "@/lib/auth-options";
import prisma from "@/lib/connect";
import { NextResponse } from "next/server";
// import { CATEGORY_SLUG } from "@/lib/constants";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const catSlug = searchParams.get("cat");

    const posts = await prisma.post.findMany({
      where: {
        ...(catSlug && catSlug !== "null" && catSlug !== "" && { catSlug }),
      },
      include: {
        cat: true,
      },
    });
    return NextResponse.json(posts, { status: 200 });
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
    console.log(dataFromBody);

    const post = await prisma.post.create({
      data: {
        ...dataFromBody,
      },
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
