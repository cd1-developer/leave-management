import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { Next_Auth } from "@/utils/Next_Auth";

export const POST = async (req: NextRequest) => {
  try {
    const { userId, organizationId } = await req.json();

    const session = await getServerSession(Next_Auth);
    if (!session) {
      return NextResponse.redirect(new URL("/Login", req.url));
    }

    if (!userId || !organizationId) {
      return NextResponse.json(
        { success: false, message: "Invalid Input" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const newMember = await prisma.orgMember.create({
      data: {
        userId,
        organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true,
            email: true,
            createdAt: true,
            organizations: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Member added",
      newMember,
    });
  } catch (error) {
    console.error("Error adding member:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong", error: String(error) },
      { status: 500 }
    );
  }
};
