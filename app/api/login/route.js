import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();

    // Validate request body
    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Email, Password, and Role are required" },
        { status: 400 }
      );
    }

    let user = null;

    if (role === "admin") {
      // Use admin credentials from .env
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD; // hashed or plain text?

      // Compare provided email
      if (email !== adminEmail) {
        return NextResponse.json(
          { message: "Invalid admin email or password" },
          { status: 401 }
        );
      }

      // Compare password (assuming stored in plain text; if hashed, use bcrypt.compare)
      const isPasswordCorrect = password === adminPassword;

      if (!isPasswordCorrect) {
        return NextResponse.json(
          { message: "Invalid admin email or password" },
          { status: 401 }
        );
      }

      // Create a fake user object for admin
      user = {
        _id: "admin-id",
        name: "Admin",
        email: adminEmail,
        role: "admin",
      };
    } else {
      // Connect to DB
      await connectDB();

      // Find user by email (make sure password is included)
      user = await User.findOne({ email }).select("+password");
      if (!user) {
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Ensure password exists in DB
      if (!user.password) {
        return NextResponse.json(
          { message: "User has no password set. Please register again." },
          { status: 500 }
        );
      }

      // Compare password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Role validation
      if (user.role !== role) {
        return NextResponse.json(
          { message: `This account is not registered as ${role}` },
          { status: 403 }
        );
      }
    }

    // Generate JWT token (expires in 45 minutes)
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "45m" }
    );

    // Return token + user info
    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

// For testing API health
export async function GET() {
  return NextResponse.json({ message: "Login API working ✅" });
}
