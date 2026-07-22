import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function bufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString("base64");
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const catalogId = formData.get("catalogId") as string;
    const files = formData.getAll("files") as File[];

    if (!catalogId) {
      return NextResponse.json(
        { error: "Catalog ID is required" },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const catalog = await prisma.catalog.findUnique({
      where: { id: catalogId },
    });

    if (!catalog) {
      return NextResponse.json({ error: "Catalog not found" }, { status: 404 });
    }

    // Get current max sortOrder in catalog
    const lastImage = await prisma.image.findFirst({
      where: { catalogId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    let currentSortOrder = (lastImage?.sortOrder ?? -1) + 1;
    const uploadedImages = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const base64 = bufferToBase64(bytes);
      const dataUri = `data:${file.type};base64,${base64}`;

      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "fsecretai",
        resource_type: "image",
      });

      const publicId = uploadResult.public_id;
      const url = cloudinary.url(publicId, {
        quality: "auto",
        fetch_format: "auto",
      });
      const thumbnailUrl = cloudinary.url(publicId, {
        width: 400,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      });

      const image = await prisma.image.create({
        data: {
          publicId,
          url,
          thumbnailUrl,
          width: uploadResult.width,
          height: uploadResult.height,
          catalogId,
          sortOrder: currentSortOrder++,
        },
      });

      uploadedImages.push(image);
    }

    return NextResponse.json(uploadedImages, { status: 201 });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}
