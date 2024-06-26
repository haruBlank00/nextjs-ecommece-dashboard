"use client";

import { Button } from "@/components/ui/button";
import { useIsMounted } from "@/hooks/use-isMounted";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const { isMounted } = useIsMounted();

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => {
          return (
            <div
              key={url}
              className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
            >
              <div className="z-10 absolute top-2 right-2">
                <Button
                  type="button"
                  variant={"destructive"}
                  size={"icon"}
                  onClick={() => onRemove(url)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <Image
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                className="object-cover"
                alt="Image"
                src={url}
              />
            </div>
          );
        })}
      </div>

      <CldUploadWidget onUpload={onUpload} uploadPreset="tvpupx78" >
        {({ open }) => {
          return (
            <Button
              type="button"
              disabled={disabled}
              variant={"secondary"}
              onClick={() => open()}
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
