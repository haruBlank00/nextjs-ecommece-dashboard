import prismadb from "@/lib/prisma.db";
import ColorForm from "./color-form";

const ColorPage = async ({
  params: { storeId, colorId },
}: {
  params: { storeId: string; colorId: string };
}) => {
  const color = await prismadb.color.findFirst({
    where: {
      storeId,
      id: colorId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
