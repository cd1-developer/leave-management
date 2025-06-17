import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { Next_Auth } from "@/utils/Next_Auth";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(Next_Auth);
  if (!session) {
    return NextResponse.redirect(new URL("/Login", req.url));
  }
  const allUsers = await prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  return NextResponse.json({ success: true, allUsers });
};
