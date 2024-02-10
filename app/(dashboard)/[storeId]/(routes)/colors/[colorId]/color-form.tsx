"use client";

import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ColorFormProps {
  initialData: Size | null;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Please enter size name" }),
  value: z.string().min(4).regex(/^#/, { message: "Please enter size value" }),
});

type SizeFormValues = z.infer<typeof formSchema>;

const SizeForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { storeId, colorId } = useParams();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit existing color" : "Add a new color";
  const action = initialData ? "Save changes" : "Create";
  const toastMessage = initialData ? "Color updated" : "Color created";

  const onSubmit = async (data: ColorFormProps) => {
    const postUrl = `/api/${storeId}/colors`;
    const patchUrl = `${postUrl}/${colorId}`;
    const url = initialData ? patchUrl : postUrl;
    const method = initialData ? "PATCH" : "POST";

    try {
      setLoading(true);
      await axios({
        method,
        url,
        data,
      });

      router.push(`/${storeId}/colors`);
      router.refresh();
      toast.success(toastMessage);
    } catch (e) {
      toast.error("Something went wrong!!");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/colors/${colorId}`);

      // router.push(`/${storeId}/colors`);
      router.refresh();
      toast.success("Color deleted.");
    } catch (e) {
      toast.error("Some error occured.");
      console.log({ e });
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={onDelete}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            variant={"destructive"}
            size={"icon"}
            disabled={loading}
            onClick={() => setOpen(true)}
          >
            <Trash className="icon" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      ></div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SizeForm;
