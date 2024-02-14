"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface BillboardClientProps {
  data: Billboard[];
}
export const BillboardClient = ({ data }: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();

  const title = `Orders (${data.length})`;
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description="Manage orders for your store" />
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="label" />

      <Heading title="API" description="Api calls for orders" />
      <Separator />
      <ApiList entityName="orders" entityIdName="orderId" />
    </>
  );
};
