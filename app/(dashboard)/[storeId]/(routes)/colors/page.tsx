import prismadb from "@/lib/prisma.db";
import { Color } from "@prisma/client";
import { format } from "date-fns";
import { ColorsClient } from "./components/clients";

interface Params {
  params: { storeId: string };
}

const ColorsPage = async ({ params }: Params) => {
  const storeId = params.storeId;

  const count = await prismadb.color.count();
  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors = colors.map((color: Color) => ({
    ...color,
    createdAt: format(color.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formattedColors} count={count} />
      </div>
    </div>
  );
};

export default ColorsPage;
