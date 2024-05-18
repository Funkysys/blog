// /api/categories

// import { Category } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/connect";
import { NextApiRequest, NextApiResponse } from "next";


// GET POST PUT
export const GET = async (req: NextApiRequest,res: NextApiResponse) => {

    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', 'https://discophiles.vercel.app'); // Remplacez par votre domaine autorisé
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(200).end();
        return;
      } else {
        res.setHeader('Access-Control-Allow-Origin', 'https://example.com'); // Remplacez par votre domaine autorisé
      }
    try {
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong !" }, { status: 500 });
    }
    // get all categories
    // res.json({ categories: [] })
}