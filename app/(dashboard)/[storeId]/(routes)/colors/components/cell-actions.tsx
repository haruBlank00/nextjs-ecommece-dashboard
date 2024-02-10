"use client";

import AlertModal from "@/components/modals/alert-modal";
import { ColorsColumn } from "./columns";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

export const CellAction = ({ data }: { data: ColorsColumn }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { storeId } = useParams();
  const colorId = data.id;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/colors/${colorId}`);
      toast.success("Color deleted successfully");
      router.refresh();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (colorId: string) => {
    navigator.clipboard.writeText(colorId);
    toast.success("Size Id copied successfully");
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={handleDelete}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="icon" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/${storeId}/colors/${colorId}`)}
          >
            <Edit className="mr-2 icon" /> Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleCopy(colorId)}>
            <Copy className="icon mr-2" /> Copy Id
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="icon mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
