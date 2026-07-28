"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Film, ImageIcon, Loader2 } from "lucide-react";
import { getUploadSignatureAction, registerUploadedAsset } from "@/actions/media.actions";
import { toast } from "sonner";
import Image from "next/image";

type Props = {
  value?: string | null;
  onChange: (value: string, publicId?: string) => void;
  onClear?: () => void;
  accept?: "image/*" | "video/*" | "image/*,video/*";
  label?: string;
};

export function MediaUploader({ value, onChange, onClear, accept = "image/*", label = "Upload file" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      // 1. Get signed upload parameters from server
      const sigRes = await getUploadSignatureAction({});
      if (!sigRes.ok) throw new Error(sigRes.error);
      const { signature, timestamp, folder, apiKey, cloudName } = sigRes.data;

      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", String(timestamp));
      formData.append("folder", folder);
      formData.append("api_key", apiKey ?? "");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error?.message || "Upload failed");
      }

      const cldData = await res.json();
      const mediaType = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";

      // 3. Register asset in local DB
      const regRes = await registerUploadedAsset({
        publicId: cldData.public_id,
        url: cldData.url,
        secureUrl: cldData.secure_url,
        type: mediaType,
        format: cldData.format,
        width: cldData.width,
        height: cldData.height,
        bytes: cldData.bytes,
        duration: cldData.duration,
      });

      if (!regRes.ok) throw new Error(regRes.error);

      onChange(cldData.secure_url, cldData.public_id);
      toast.success("Uploaded successfully.");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Upload failed. Please check your credentials.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const isVideo = value?.endsWith(".mp4") || value?.includes("/video/upload/");

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative flex aspect-video w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {isVideo ? (
            <video src={value} controls className="h-full w-full object-cover" />
          ) : (
            <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
          )}
          <button
            type="button"
            onClick={() => {
              if (onClear) onClear();
              onChange("");
            }}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`flex aspect-video w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors duration-200 ${
            dragActive ? "border-accent bg-accent/5" : "border-muted hover:border-accent hover:bg-secondary/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleChange}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-sm font-medium text-muted-foreground">Uploading asset...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-3 rounded-full bg-accent/10 p-3 text-accent">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to choose file</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3 bg-secondary/80 px-2.5 py-1 rounded-md">
                {accept.includes("image") && <ImageIcon className="h-3 w-3" />}
                {accept.includes("video") && <Film className="h-3 w-3" />}
                <span>{accept.replace("/*", "").toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
