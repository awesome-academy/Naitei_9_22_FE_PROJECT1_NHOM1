import { NextRequest, NextResponse } from "next/server";
import { publicApi } from "@/lib/api/axios";
import { User, UserResponse, UserWithoutPassword } from "@/types/user.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email and password
    const users = await publicApi.get<User[]>(
      `/users?email=${email}&password=${password}`
    );

    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = users[0];

    if (user.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Account is inactive" },
        { status: 403 }
      );
    }

    // Create session data
    const sessionData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Return user data with session cookie
    const { password: _, ...userWithoutPassword } = user;
    const successResponse: UserResponse = {
      success: true,
      data: userWithoutPassword,
      message: "Login successful",
    };

    const responseWithCookie = NextResponse.json(successResponse);

    responseWithCookie.cookies.set(
      "user_session",
      JSON.stringify(sessionData),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      }
    );

    return responseWithCookie;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
