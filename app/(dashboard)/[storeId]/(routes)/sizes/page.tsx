import prismadb from "@/lib/prisma.db";
import { SizesClient } from "./components/clients";
import { Size } from "@prisma/client";
import { format } from "date-fns";

interface Params {
  params: { storeId: string };
}

const SizesPage = async ({ params }: Params) => {
  const storeId = params.storeId;

  const count = await prismadb.size.count();
  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes = sizes.map((size: Size) => ({
    ...size,
    createdAt: format(size.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} count={count} />
      </div>
    </div>
  );
};

export default SizesPage;
