import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    // Extract 'id' from the query parameters
    const { id } = params;

    // If 'id' is missing, return a 400 Bad Request response
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid input: 'id' is required." },
        { status: 400 }
      );
    }

    // Query the database to find organizations matching the given organization id
    let organizations = await prisma.organization.findFirst({
      where: { userId: id },
      include: {
        orgMembers: true,
      },
    });

    if (!organizations) {
      const orgMember = await prisma.orgMember.findFirst({
        where: {
          userId: id,
        },
        include: {
          organization: true,
        },
      });
      if (orgMember) {
        let organizationId = orgMember.organizationId;

        organizations = await prisma.organization.findFirst({
          where: {
            id: organizationId,
          },
          include: {
            orgMembers: true,
          },
        });
      }
    }

    // Return the fetched organization(s) in the response
    return NextResponse.json({
      success: true,
      organizations: organizations ?? {},
    });
  } catch (error: any) {
    // Log the error for debugging
    console.error("Error fetching organization:", error);

    // Return a generic error message with optional detailed message in development
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch organization.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
