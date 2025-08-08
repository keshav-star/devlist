"use server";

import { User } from "@/models/Playlist";
// import { generateToken } from "@/lib/generateToken";
import { cookies } from "next/headers";

export async function generateAndSetToken(name: string) {
  // Validation
  if (!name) return { success: false, message: "Name is required" };

  //   const secret = name + new Date().toISOString();
  //   const token = generateToken({ secret });

  // Save to DB if needed here (e.g., log or store session)
  const user = await User.create({ name });
  const token = user._id.toString();

  // Set in cookie
  const cookie = await cookies();
  cookie.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return { success: true, token };
}

export async function verifyToken(token: string) {
  try {
    const user = await User.findById(token);
    if (!user) return { success: false, message: "Invalid Token" };

    const cookie = await cookies();
    cookie.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return { success: true, user };
  } catch (err) {
    console.log(err);
    return { success: false, message: "An error occurred" };
  }
}
