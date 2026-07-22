import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ids, catalogId, sortOrders } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No image IDs provided" }, { status: 400 });
    }

    // Validate catalogId if provided
    if (catalogId) {
      const catalog = await prisma.catalog.findUnique({
        where: { id: catalogId },
      });
      if (!catalog) {
        return NextResponse.json({ error: "Catalog not found" }, { status: 404 });
      }
    }

    // If individual sortOrders provided
    if (sortOrders && Array.isArray(sortOrders)) {
      const updates = sortOrders
        .filter((item: { id: string; sortOrder: number }) => ids.includes(item.id))
        .map((item: { id: string; sortOrder: number }) =>
          prisma.image.update({
            where: { id: item.id },
            data: {
              sortOrder: item.sortOrder,
              ...(catalogId && { catalogId }),
            },
          })
        );

      await prisma.$transaction(updates);
    } else if (catalogId) {
      // Move all selected images to another catalog
      await prisma.image.updateMany({
        where: { id: { in: ids } },
        data: { catalogId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error batch updating images:", error);
    return NextResponse.json(
      { error: "Failed to update images" },
      { status: 500 }
    );
  }
}
