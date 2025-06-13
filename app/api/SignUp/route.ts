import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {
    const { username, email, password } = await req.json();

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email  already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already in use",
        },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
        role: "USER",
      },
    });
    return NextResponse.json({
      success: true,
      message: "Signup successful!",
    });
  } catch (error) {
    console.error("User registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 } // Internal server error
    );
  }
};
