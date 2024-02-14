import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const storeId = params.storeId;
    if (!storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const productId = params.productId;
    const product = await prismadb.product.findFirst({
      where: {
        id: productId,
        storeId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCT_GET_${params.productId}]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
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

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price: Number(price),
        categoryId,
        colorId,
        isArchived,
        isFeatured,
        sizeId,
        storeId,

        images: {
          deleteMany: {},
        },
      },
    });
    console.log({ images });
    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    console.log({ product });
    return NextResponse.json(product);
  } catch (e) {
    console.log(`[SIZE_PATCH]`, e);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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

    const productId = params.productId;
    const product = await prismadb.product.deleteMany({
      where: {
        id: productId,
        storeId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCT_DELETE]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
