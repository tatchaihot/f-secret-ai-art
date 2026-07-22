import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const catalogs = await prisma.catalog.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { images: true },
        },
        images: {
          orderBy: { sortOrder: "asc" },
          take: 4,
          select: {
            id: true,
            url: true,
            thumbnailUrl: true,
          },
        },
      },
    });

    return NextResponse.json(catalogs);
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch catalogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, sortOrder } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const catalog = await prisma.catalog.create({
      data: {
        name,
        description: description || null,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(catalog, { status: 201 });
  } catch (error) {
    console.error("Error creating catalog:", error);
    return NextResponse.json(
      { error: "Failed to create catalog" },
      { status: 500 }
    );
  }
}
