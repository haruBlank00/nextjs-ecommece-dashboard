import prismadb from "@/lib/prisma.db";
import { formatter } from "@/lib/utils";
import { Order, OrderItem } from "@prisma/client";
import { format } from "date-fns";
import { BillboardClient } from "./components/clients";
import { OrderColumn } from "./components/columns";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;
  const orders = await prismadb.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item: Order) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem: OrderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce(
        (total: number, item: OrderItem) => total + Number(item.product.price),
        0
      )
    ),
    isPait: item.isPaid,
    createdAt: format(item.createdAd, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
