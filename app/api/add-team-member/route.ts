import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const { orgMemberId, reportManagerId } = await req.json();

    // Validate required inputs
    if (!orgMemberId || !reportManagerId) {
      return NextResponse.json(
        { success: false, message: "Invalid inputs" },
        { status: 400 }
      );
    }

    // Check if the OrgMember exists
    const orgMember = await prisma.orgMember.findFirst({
      where: {
        id: orgMemberId,
      },
    });

    // If OrgMember not found, return a 404 error
    if (!orgMember) {
      return NextResponse.json(
        {
          success: false,
          message: "Org Member not found",
        },
        { status: 404 }
      );
    }

    // Update the OrgMember to assign them under the specified Report Manager
    await prisma.orgMember.update({
      where: {
        id: orgMemberId,
      },
      data: {
        reportManagerId,
      },
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Team member assigned successfully",
    });
  } catch (error: any) {
    // Catch and log any server or database errors
    console.error("Error assigning team member:", error.message);

    // Return a server error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to assign team member",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
