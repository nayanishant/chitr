import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Image from "@/models/Image";

export async function GET() {
  try {
    await dbConnect();

    const images = await Image.find({})
      .sort({ createdAt: -1 })
      .limit(15)
      .populate("userId", "name")
      .select("url publicId userId createdAt");

    if (!images.length) {
      return NextResponse.json({ error: "No images found" }, { status: 404 });
    }

    return NextResponse.json({ images }, { status: 200 });
  } catch (error: any) {
    console.error("❌ API Error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch images", details: error.message },
      { status: 500 }
    );
  }
}
