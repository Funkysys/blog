import { NextResponse } from "next/server";
import prisma from "@/lib/connect";

// GET SINGLE POST
export const GET = async (
    req: Request, 
    {params}: { params: { slug: string }}
) => {
    const { slug } = params;

    try {
        const post = await prisma.post.update({
            where: { slug },
            data: { nbView : { increment: 1 } }
        });
        return NextResponse.json(post, { status: 200 });

    } catch (error) {
        return NextResponse.json({error:"something went wrong !" }, { status: 500 });
    }
};