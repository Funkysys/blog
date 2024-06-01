import { getAuthSession } from "@/lib/auth-options";
import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const session = await getAuthSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Vous n'êtes pas autorisé" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const dataFromBody = {
      title: body.title,
      content: body.content,
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

    const post = await prisma.post.update({
      where: { slug },
      data: {
        ...dataFromBody,
      },
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur s'est produite" },
      { status: 500 }
    );
  }
}
