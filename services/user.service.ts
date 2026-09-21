import { prisma } from "@/lib/db/client";
import { NotFoundError } from "@/lib/errors/app-error";
import { UpdateProfileInput } from "@/lib/validation/schemas";

export class UserService {
  static async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? undefined,
      },
    });

    return {
      id: updated.id,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      phone: updated.phone,
      avatarUrl: updated.avatarUrl,
    };
  }
}
