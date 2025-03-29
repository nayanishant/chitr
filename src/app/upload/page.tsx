"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { signOut } from "next-auth/react"; // 🔹 Import signOut
import SingleImageDropzone from "@/app/components/SingleImageDropzone";
import { toast } from "sonner";

export default function SingleImageDropzoneUsage() {
  const [file, setFile] = useState<File | undefined>();
  const { edgestore } = useEdgeStore();

  return (
    <div className="flex flex-col justify-center items-center h-full gap-4 p-4 sm:p-6">
      <SingleImageDropzone
        width={550}
        height={550}
        value={file}
        onChange={(file) => setFile(file)}
        className="max-w-[90vw] sm:max-w-[550px]"
      />
      
      <button
        className="w-[8rem] md:w-[10rem] bg-gray-700 p-2 text-white rounded cursor-pointer 
        hover:bg-gray-600 uppercase text-sm md:text-base transition-all"
        onClick={async () => {
          if (!file) {
            toast.error("Please select a file first.");
            return;
          }
        
          const toastId = toast.loading("Uploading image...");
        
          try {
            const res = await edgestore.publicFiles.upload({
              file,
              onProgressChange: (progress) => {
                toast.loading(`Uploading... ${progress}%`, { id: toastId });
              },
            });
        
            const metadata = {
              userId: res.metadata?.userId,
              width: res.metadata?.width || null,
              height: res.metadata?.height || null,
              format: file.type,
              size: file.size,
            };
        
            const response = await fetch("/api/uploadImage", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                file: {
                  url: res.url,
                  id: res.id || file.name,
                  name: file.name,
                  type: file.type,
                  size: file.size,
                },
                metadata,
              }),
            });
        
            if (!response.ok) {
              throw new Error("Failed to upload image.");
            }
        
            const data = await response.json();
            toast.dismiss(toastId);
            toast.success("✅ Upload Successful!", {
              description: `Image saved with ID: ${data.newImage.publicId}`,
            });
            
            setFile(undefined);
            console.log("✅ Upload Successful:", data);
          } catch (error) {
            toast.dismiss(toastId);
            toast.error("❌ Upload Failed!", {
              description: "Something went wrong while uploading.",
            });
            console.error("❌ Upload Failed:", error);
          }
        }}
      >
        Upload
      </button>
      <button
        className="w-[8rem] md:w-[10rem] bg-red-600 p-2 text-white rounded cursor-pointer 
        hover:bg-red-500 uppercase text-sm md:text-base transition-all mt-4"
        onClick={() => signOut()} // 🔹 Calls NextAuth's signOut function
      >
        Logout
      </button>

    </div>
  );
}
