import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
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

    const colorId = params.colorId;
    const color = await prismadb.color.findFirst({
      where: {
        id: colorId,
        storeId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log(`[size_GET_${params.colorId}]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) => {
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

    const color = await prismadb.color.update({
      where: {
        storeId,
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (e) {
    console.log(`[SIZE_PATCH]`, e);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
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

    const colorId = params.colorId;
    const color = await prismadb.color.deleteMany({
      where: {
        id: colorId,
        storeId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log(`[SIZE_DELETE]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
