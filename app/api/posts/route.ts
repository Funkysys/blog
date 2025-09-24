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
        Category: true,
        User: true,
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
    console.error("API /api/posts error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  const body = await req.json();

  const team = Array.isArray(body.team) ? body.team : [];

  const trackList =
    body.trackList && Array.isArray(body.trackList)
      ? body.trackList.map((t: any) => (typeof t === "string" ? JSON.parse(t) : t))
      : [];

  const links =
    body.links && Array.isArray(body.links)
      ? body.links.map((l: any) => (typeof l === "string" ? JSON.parse(l) : l))
      : [];

  try {
    const session = await getAuthSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "You are not authorized" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email || "" },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title: body.title || "",
        content: body.content || "",
        catSlug: body.catSlug || "",
        slug: body.slug || "",
        image: body.image || "",
        release: body.release || null,
        artist: body.artist || "",
        team: team,
        trackList: trackList,
        links: links,
        userId: user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};