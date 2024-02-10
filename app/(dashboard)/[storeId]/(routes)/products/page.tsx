import prismadb from "@/lib/prisma.db";
import { Product } from "@prisma/client";
import { format } from "date-fns";
import { ProductsClient } from "./components/clients";
import { formatter } from "@/lib/utils";
import { ProductColumns } from "./components/columns";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;
  const products = await prismadb.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const count = await prismadb.product.count();

  const formattedProducts: ProductColumns[] = products.map((item: Product) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    size: item.size.value,
    category: item.category.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} count={count} />
      </div>
    </div>
  );
};

export default ProductsPage;
