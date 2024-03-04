import { auth } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/api";
import { prisma } from "./db";

export const getUserFromClerkID = async (select = { id: true }) => {
  const { userId } = await auth();
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId as string,
    },
    select,
  });

  return user;
};

export const syncNewUser = async (clerkUser: User) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  if (!existingUser) {
    const email = clerkUser.emailAddresses[0].emailAddress;

    await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
      },
    });
  }
};
