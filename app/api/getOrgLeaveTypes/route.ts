import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// GET handler to fetch all leave types for a given organization
export const GET = async (req: NextRequest) => {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    // Destructure 'organizationId' from the query parameters
    const { organizationId } = params;

    // Validate the presence of 'organizationId'
    if (!organizationId) {
      return NextResponse.json(
        { success: false, message: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Fetch all leave types associated with the given organization
    const leaveTypes =
      (await prisma.leaveTypes.findMany({
        where: {
          organizationId,
        },
      })) ?? [];

    // Return the leave types as JSON
    return NextResponse.json({ success: true, leaveTypes });
  } catch (error) {
    // Log and return error if any unexpected issue occurs
    console.error("Error fetching leave types:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong", error },
      { status: 500 }
    );
  }
};
