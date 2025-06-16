import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export const DELETE = async (req: NextRequest) => {
  try {
    // Parse URL search parameters
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    // Extract the 'id' parameter from the URL
    const { id } = params;

    // If 'id' is missing, return a 400 Bad Request response
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Leave Type ID is required",
        },
        { status: 400 }
      );
    }

    // Check if the Leave Type exists in the database
    const leaveType = await prisma.leaveTypes.findFirst({
      where: { id },
    });

    // If not found, return a 404 Not Found response
    if (!leaveType) {
      return NextResponse.json(
        {
          success: false,
          message: "Leave Type not found",
        },
        { status: 404 }
      );
    }

    // Delete the leave type from the database
    await prisma.leaveTypes.delete({
      where: { id },
    });

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "Leave Type Deleted Successfully",
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error deleting leave type:", error);

    // Return a generic error response
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while deleting leave type",
      },
      { status: 500 }
    );
  }
};
