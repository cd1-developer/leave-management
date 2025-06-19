import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    // Extract 'organizationId' from the query parameters
    const { organizationId } = params;

    // If 'organizationId' is missing, return a 400 Bad Request response
    if (!organizationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input: 'organizationId' is required.",
        },
        { status: 400 }
      );
    }

    // Query the database to find report managers in the given organization
    const reportManagers =
      (await prisma.reportManager.findMany({
        where: { organizationId },
      })) ?? [];

    // Return success response
    return NextResponse.json({ success: true, reportManagers });
  } catch (error: any) {
    // Log the error for debugging
    console.error("Error fetching report managers:", error.message);

    // Return generic server error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch report managers.",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
