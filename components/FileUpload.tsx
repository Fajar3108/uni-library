"use client";

import React, { useRef, useState } from "react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Image as IKImage, ImageKitProvider } from "@imagekit/next";
import config from "@/lib/config";

interface Props {
  onFileChange: (filePath: string) => void;
}

type UploadedFile = {
  fileId: string;
  filePath: string;
};

const FileUpload = ({ onFileChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const { uploadFile, deleteFile, progress } = useImageUpload();

  const handleFileChange = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }

    const file = fileInput.files[0];

    const previousFileId = uploadedFile?.fileId;
    const res = await uploadFile(file);

    if (!res.fileId || !res.filePath) {
      throw new Error("ImageKit upload did not return file details");
    }

    setUploadedFile({ fileId: res.fileId, filePath: res.filePath });
    onFileChange(res.filePath);

    if (previousFileId) {
      try {
        console.log("delete triggered");
        await deleteFile(previousFileId);
      } catch (error) {
        console.error("Failed to delete previous ImageKit file", error);
      }
    }
  };

  return (
    <>
      <Input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <button
        type="button"
        className="upload-btn"
        onClick={(e) => {
          e.preventDefault();

          if (fileInputRef.current) {
            fileInputRef.current?.click();
          }
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className="text-base text-light-100">Upload a File</p>
      </button>

      {uploadedFile?.filePath && (
        <>
          <p className="upload-filename">{uploadedFile.filePath}</p>
          <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint}>
            <IKImage
              src={uploadedFile.filePath}
              alt={uploadedFile.filePath}
              width={300}
              height={300}
            />
          </ImageKitProvider>
        </>
      )}

      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}
    </>
  );
};
export default FileUpload;
