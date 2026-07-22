import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          id: "default",
          title: "F-Secret AI Art",
          description: "รับสร้างภาพ AI คุณภาพสูง ตามสไตล์ที่คุณต้องการ",
          lineId: "tatchaihot",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, lineId, lineQrUrl, logoUrl } = body;

    const settings = await prisma.siteSetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        title: title || "F-Secret AI Art",
        description: description || "",
        lineId: lineId || "tatchaihot",
        lineQrUrl: lineQrUrl || null,
        logoUrl: logoUrl || null,
      },
      update: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(lineId !== undefined && { lineId }),
        ...(lineQrUrl !== undefined && { lineQrUrl }),
        ...(logoUrl !== undefined && { logoUrl }),
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
