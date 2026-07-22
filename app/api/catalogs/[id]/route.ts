import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const catalog = await prisma.catalog.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            publicId: true,
            url: true,
            thumbnailUrl: true,
            width: true,
            height: true,
            sortOrder: true,
          },
        },
      },
    });

    if (!catalog) {
      return NextResponse.json({ error: "Catalog not found" }, { status: 404 });
    }

    return NextResponse.json(catalog);
  } catch (error) {
    console.error("Error fetching catalog:", error);
    return NextResponse.json(
      { error: "Failed to fetch catalog" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, sortOrder } = body;

    const catalog = await prisma.catalog.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(catalog);
  } catch (error) {
    console.error("Error updating catalog:", error);
    return NextResponse.json(
      { error: "Failed to update catalog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.catalog.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting catalog:", error);
    return NextResponse.json(
      { error: "Failed to delete catalog" },
      { status: 500 }
    );
  }
}
