import { apiSuccess } from "@/lib/errors/handler";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST() {
  const response = apiSuccess(null, "Logged out successfully");

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
