"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";

import { useRef, useState } from "react";
import { deleteImageKitFile, getUploadAuth } from "@/lib/imagekit";
import config from "@/lib/config";

export function useImageUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const abortControllerRef = useRef(new AbortController());

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);

      const { signature, expire, token } = await getUploadAuth();

      return await upload({
        file,
        fileName: file.name,
        signature,
        expire,
        token,
        publicKey: config.env.imagekit.publicKey,
        useUniqueFileName: true,
        abortSignal: abortControllerRef.current.signal,
        onProgress: ({ loaded, total }) => {
          setProgress(Math.round((loaded / total) * 100));
        },
      });
    } catch (error) {
      handleUploadError(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    abortControllerRef.current.abort();

    abortControllerRef.current = new AbortController();
  };

  const deleteFile = async (fileId: string) => {
    await deleteImageKitFile(fileId);
  };

  return {
    progress,
    isUploading,
    uploadFile,
    deleteFile,
    cancelUpload,
  };
}

function handleUploadError(error: unknown) {
  if (error instanceof ImageKitAbortError) {
    console.error("Upload aborted", error.reason);
    return;
  }

  if (error instanceof ImageKitInvalidRequestError) {
    console.error("Invalid request", error.message);
    return;
  }

  if (error instanceof ImageKitUploadNetworkError) {
    console.error("Network error", error.message);
    return;
  }

  if (error instanceof ImageKitServerError) {
    console.error("Server error", error.message);
    return;
  }

  console.error(error);
}
