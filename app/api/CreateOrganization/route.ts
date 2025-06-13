import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { Next_Auth } from "@/utils/Next_Auth";

export const POST = async (req: NextRequest) => {
  try {
    const { organizationName, industryType, organizationDiscription, userId } =
      await req.json();

    // Session check (can be enabled later if needed)
    const session = await getServerSession(Next_Auth);
    if (!session) {
      return NextResponse.redirect(new URL("/Login", req.url));
    }

    if (
      !organizationName ||
      !industryType ||
      !organizationDiscription ||
      !userId
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Create new organization
    const newOrganization = await prisma.organization.create({
      data: {
        organizationName,
        industryType,
        organizationDiscription,
        userId,
      },
    });

    // adding ADMIN in it's own organization

    await prisma.orgMember.create({
      data: {
        organizationId: newOrganization.id,
        userId,
      },
    });

    // Update user role to ADMIN
    await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Organization created successfully.",
        organization: newOrganization,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating organization:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create organization.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
