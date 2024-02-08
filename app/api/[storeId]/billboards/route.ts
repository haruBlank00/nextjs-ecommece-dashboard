import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();
    const { label, imageUrl } = body;
    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image is required", { status: 400 });
    }

    const storeId = params.storeId;
    if (!storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });

    console.log(
      `[BILLBOARD_POST] - A new store has been created successfully. :)`,
      billboard
    );

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARD_POST]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const storeId = params.storeId;
    if (!storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        id: storeId,
      },
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 401 });
    }

    const billboard = await prismadb.billboard.findMany({
      where: {
        storeId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARD_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
