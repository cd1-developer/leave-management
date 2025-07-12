import { prisma } from "@/utils/prisma";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const {
    LeaveTypes,
    Day,
    StartDateTime,
    EndDateTime,
    UserId,
    OrganizationId,
    reportManagerId,
  } = await req.json();
  if (
    !LeaveTypes ||
    !Day ||
    !StartDateTime ||
    !EndDateTime ||
    !UserId ||
    !OrganizationId ||
    !reportManagerId
  ) {
    return NextResponse.json({ success: false, message: "Invalid Inputs" });
  }
  try {
    const newAppliedLeave = await prisma.leaves.create({
      data: {
        LeaveTypes,
        Day,
        StartDateTime,
        EndDateTime,
        UserId,
        OrganizationId,
        reportManagerId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Leave applied successfully",
      newAppliedLeave,
    });
  } catch (error: any) {
    console.log(`Error while appling for leaves ERROR ${error.message}`);
    return NextResponse.json({
      success: false,
      message: "Error while appling for leaves",
    });
  }
};
