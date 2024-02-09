"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-actions";

export type SizesColumn = {
  id: string;
  name: string;
  createdAt: string;
};

export const columns: ColumnDef<SizesColumn>[] = [
  {
    accessorKey: "name",
    header: () => {
      return (
        <Button>
          Name
          <ArrowUpDown className="ml icon" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
