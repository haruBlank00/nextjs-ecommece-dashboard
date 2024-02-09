import prismadb from "@/lib/prisma.db";
import { SizesClient } from "./components/clients";

interface Params {
  params: { storeId: string };
}

const SizesPage = async ({ params }: Params) => {
  const storeId = params.storeId;

  const count = await prismadb.size.count();
  const data = await prismadb.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={data} count={count} />
      </div>
    </div>
  );
};

export default SizesPage;
