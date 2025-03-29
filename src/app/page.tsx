"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface ImageData {
  _id: string;
  url: string;
  publicId: string;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
  };
}

export default function LatestImages() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/getAllImages");

        if (!res.ok) {
          throw new Error(`Failed to fetch images: ${res.statusText}`);
        }

        const data = await res.json();
        setImages(data.images);
        toast.success("Latest images loaded successfully! 🎉");
      } catch (err) {
        toast.error("Error loading images. Please refresh the page!");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleDelete = async (imageId: string) => {
    const toastId = toast.loading("Deleting image...");

    try {
      const res = await fetch("/api/deleteImage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete image");
      }

      setImages(images.filter((image) => image._id !== imageId));
      toast.success("✅ Image deleted successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen flex flex-col items-center">
      <Toaster richColors position="top-right" />
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-5 gap-4 px-4 py-4 w-full max-w-6xl">
        {loading && <p className="text-center text-white">Loading images...</p>}

        {images.map((image) => (
          <div key={image._id} className="relative mb-4 break-inside-avoid">
            <Image
              src={image.url}
              alt={image.publicId}
              width={300}
              height={400}
              className="w-full h-auto object-cover rounded-lg"
            />
            {session?.user?.id === image.userId?._id && (
              <button
                onClick={() =>
                  toast("Are you sure?", {
                    description: "Do you really want to delete this image?",
                    action: {
                      label: "Delete",
                      onClick: () => handleDelete(image._id),
                    },
                  })
                }
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              >
                <FaTrash size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
