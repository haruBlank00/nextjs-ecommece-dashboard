"use client";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Product } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./columns";

interface ProductClientProps {
  data: Product[];
  count: string;
}
export const ProductsClient = ({ data, count }: ProductClientProps) => {
  const router = useRouter();
  const params = useParams();

  const title = `Products (${count})`;
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description="Manage billboards for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="Api calls for products" />

      <Separator />

      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};
