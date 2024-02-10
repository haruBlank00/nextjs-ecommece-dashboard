"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Size } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface ColorsClientProps {
  data: Size[];
  count: string;
}

export const ColorsClient = ({ data, count }: ColorsClientProps) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  const title = `Colors ${count}`;
  const storeId = params.storeId;
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description="Manage sizes for your store" />

        <Button onClick={() => router.push(`/${storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="value" />

      <Heading title="API" description="Api calls for billboards" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};
