import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./app-error";
import { ApiErrorResponse } from "@/types/api";

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  // Handle Custom AppError
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod Validation Error
  if (error instanceof ZodError) {
    const formattedDetails = error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
      code: e.code,
    }));

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: formattedDetails,
        },
      },
      { status: 400 }
    );
  }

  // Generic/Unknown Server Error (Never expose stack trace to client)
  console.error("[Unhandled API Error]:", error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred. Please try again later.",
      },
    },
    { status: 500 }
  );
}

export function apiSuccess<T>(data: T, message?: string, status: number = 200, meta?: Record<string, unknown>) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      meta,
    },
    { status }
  );
}
