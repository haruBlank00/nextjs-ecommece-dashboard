import prismadb from "@/lib/prisma.db";
import { Category } from "@prisma/client";
import { format } from "date-fns";
import { CategoryClient } from "./components/clients";
import { Categorycolumn } from "./components/columns";

const CategoriesPage = async ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const categoryId = params.categoryId;
  const categories = await prismadb.category.findMany({
    where: {
      id: categoryId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: Categorycolumn[] = categories.map(
    (item: Category) => ({
      id: item.id,
      name: item.name,
      billboardLabel: item.billboard.label,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
