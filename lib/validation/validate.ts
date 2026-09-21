import { ZodType } from "zod";
import { ValidationError } from "@/lib/errors/app-error";

export async function validateRequest<TOutput>(
  schema: ZodType<TOutput, any, any>,
  data: unknown
): Promise<TOutput> {
  const result = await schema.safeParseAsync(data);

  if (!result.success) {
    const formattedDetails = result.error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
      code: e.code,
    }));
    throw new ValidationError("Validation failed", formattedDetails);
  }

  return result.data;
}
