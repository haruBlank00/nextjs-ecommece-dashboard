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
    const { name, billboardId } = body;
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard is required", { status: 400 });
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
    const category = await prismadb.category.create({
      data: {
        billboardId,
        name,
        storeId,
      },
    });

    console.log(
      `[CATEGORY_POST] - A new category has been created successfully. :)`,
      category
    );

    return NextResponse.json(category);
  } catch (error) {
    console.log(`[CATEGORY_POST]`, error);
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

    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.log(`[CATEGORIES_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
