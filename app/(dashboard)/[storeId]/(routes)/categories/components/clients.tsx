"use client";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Category } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./columns";

interface CategoryClientProps {
  data: Category[];
}
export const CategoryClient = ({ data }: CategoryClientProps) => {
  const router = useRouter();
  const params = useParams();

  console.log({ data });
  const title = `Categories (${data.length})`;
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description="Manage categories for your store" />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="Api calls for categories" />
      <Separator />
      <ApiList entityName="Categories" entityIdName="categoryId" />
    </>
  );
};
