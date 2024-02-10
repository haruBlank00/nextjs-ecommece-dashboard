import prismadb from "@/lib/prisma.db";
import SizeForm from "./size-form";

const SizePage = async ({
  params: { storeId, sizeId },
}: {
  params: { storeId: string; sizeId: string };
}) => {
  const size = await prismadb.size.findFirst({
    where: {
      storeId,
      id: sizeId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
