"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface ImageData {
  _id: string;
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
  };
}

export default function LatestImages() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError("Failed to load images. Please try again later.");
        toast.error("Error loading images. Please refresh the page!");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      {/* Sonner Toaster for Notifications */}
      <Toaster richColors position="top-right" />

      {loading && <p className="text-center">Loading images...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {images.map((image) => (
          <div key={image._id} className="border rounded-lg shadow p-2">
            <Image
              src={image.url}
              alt={image.publicId}
              width={image.width || 300}
              height={image.height || 200}
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-sm text-gray-600 mt-2">
              Uploaded by:{" "}
              <span className="font-semibold">
                {image.userId?.name || "Unknown User"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
