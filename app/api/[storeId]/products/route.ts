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

    const {
      categoryId,
      colorId,
      images,
      isArchived,
      isFeatured,
      name,
      price,
      sizeId,
    } = await req.json();
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("price is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("colorId is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("sizeId is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("image is required", { status: 400 });
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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        isArchived,
        isFeatured,
        sizeId,
        storeId,

        images: {
          createMany: {
            data: images,
          },
        },
      },
    });

    console.log(
      `[PRODUCT_POST] - A new store has been created successfully. :)`,
      product
    );

    return NextResponse.json(product);
  } catch (e) {
    console.log(`[PRODUCT_POST]`, e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;
    const isArchived = searchParams.get("isArchived") || undefined;

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

    const products = await prismadb.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log(`[PRODUCT_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
