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

    const { name, value } = await req.json();
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    console.log(
      `[COLOR_POST] - A new store has been created successfully. :)`,
      color
    );

    return NextResponse.json(color);
  } catch (e) {
    console.log(`[COLOR_POST]`, e);
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

    const color = await prismadb.color.findMany({
      where: {
        storeId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log(`[COLOR_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
