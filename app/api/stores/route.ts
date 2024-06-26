import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const body = await req.json();
    const { name } = body;
    if (!name) {
      return new NextResponse("Store name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    console.log(
      `[STORES_POST] - A new store has been created successfully. :)`,
      store
    );

    return NextResponse.json(store);
  } catch (error) {
    console.log(`[STORES_POST]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
