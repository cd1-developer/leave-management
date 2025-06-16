import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// API handler to add a new leave type to an organization
export const POST = async (req: NextRequest) => {
  try {
    // Parse the incoming request body
    const {
      organizationId,
      type,
      leaveInYear,
      leaveInMonth,
      colorCode,
      leaveDiscription,
    } = await req.json();

    // Basic validation for required fields
    if (
      !organizationId ||
      !type ||
      !leaveInYear ||
      !colorCode ||
      !leaveDiscription
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid inputs" },
        { status: 400 }
      );
    }

    // Create a new leave type record in the database
    const leaveType = await prisma.leaveTypes.create({
      data: {
        organizationId,
        type,
        leaveInYear,
        leaveInMonth: leaveInMonth ? leaveInMonth : 0,
        colorCode,
        leaveDiscription,
      },
    });

    // Return success response with the newly created leave type
    return NextResponse.json({
      success: true,
      message: "Leave Type added successfully",
      leaveType,
    });
  } catch (error) {
    console.error("Error creating leave type:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong", error },
      { status: 500 }
    );
  }
};
