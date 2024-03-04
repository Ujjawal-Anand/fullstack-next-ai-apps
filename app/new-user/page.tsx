import { prisma } from "@/utils/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const createNewUser = async () => {
  const user = await currentUser();

  if (user && user.id) {
    const match = prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!match) {
      await prisma.user.create({
        data: {
          clerkId: user?.id,
          email: user?.emailAddresses[0].emailAddress,
        },
      });
    }
  }

  redirect("/journal");
};

export default async function NewUserPage() {
  await createNewUser();

  return <div>...loading</div>;
}
