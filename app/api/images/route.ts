import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const catalogId = searchParams.get("catalogId");

    const images = await prisma.image.findMany({
      where: catalogId ? { catalogId } : undefined,
      orderBy: [{ catalogId: "asc" }, { sortOrder: "asc" }],
      select: {
        id: true,
        publicId: true,
        url: true,
        thumbnailUrl: true,
        width: true,
        height: true,
        sortOrder: true,
        createdAt: true,
        catalogId: true,
        catalog: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No image IDs provided" }, { status: 400 });
    }

    const images = await prisma.image.findMany({
      where: { id: { in: ids } },
      select: { id: true, publicId: true },
    });

    // Delete from Cloudinary
    for (const image of images) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (err) {
        console.error(`Failed to delete image ${image.publicId} from Cloudinary:`, err);
      }
    }

    await prisma.image.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({ success: true, deletedCount: images.length });
  } catch (error) {
    console.error("Error deleting images:", error);
    return NextResponse.json(
      { error: "Failed to delete images" },
      { status: 500 }
    );
  }
}
