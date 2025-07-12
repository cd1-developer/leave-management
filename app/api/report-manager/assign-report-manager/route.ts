import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const { userId, orgMemberId, organizationId } = await req.json();

    // Check for missing input values
    if (!userId || !orgMemberId || !organizationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing userId, orgMemberId, or organizationId.",
        },
        { status: 400 }
      );
    }

    // Check if the user exists in the database
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Update the user's role to REPORTED_MANAGER
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: "REPORTED_MANAGER",
      },
    });

    // Create a new ReportManager entry linking the user and their org member record
    let newReportManager = await prisma.reportManager.create({
      data: {
        userId,
        organizationId,
        orgMemberId,
      },
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Report Manager assigned successfully.",
      newReportManager,
    });
  } catch (error: any) {
    // Log the error for server-side debugging
    console.error("Error assigning Report Manager:", error.message);

    // Return a generic server error response
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while assigning Report Manager.",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
