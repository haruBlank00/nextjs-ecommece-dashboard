import prismadb from "@/lib/prisma.db";
import { BillboardClient } from "./components/clients";
import { BillboardColumn } from "./components/columns";
import { format } from "date-fns";
import { Billboard } from "@prisma/client";
const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAd: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(
    (item: Billboard) => ({
      id: item.id,
      label: item.label,
      createdAt: format(item.createdAd, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
