import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    // Get the organizationId from the query parameters
    const { organizationId } = params;

    // Fetch all organization members that belong to the given organizationId
    const orgMemebers =
      (await prisma.orgMember.findMany({
        where: {
          organizationId,
        },

        include: {
          user: {
            select: {
              email: true,
              username: true,
              role: true,
            },
          },
          reportManager: true,
        },
      })) ?? [];

    // Return the fetched members in the response
    return NextResponse.json({ success: true, orgMemebers });
  } catch (error: any) {
    // Log the error and return an error response
    console.error("Error fetching organization Members:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch organization Members",
        // Only include detailed error message in development mode
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
