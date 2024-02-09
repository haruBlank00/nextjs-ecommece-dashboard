"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Size } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface SizesClientProps {
  data: Size[];
  count: string;
}

export const SizesClient = ({ data, count }: SizesClientProps) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  const title = `Sizes ${count}`;
  const storeId = params.storeId;
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description="Manage sizes for your store" />

        <Button onClick={() => router.push(`/${storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable columns={[]} data={data} searchKey="value" />
    </>
  );
};
