import Spinner from "@/components/Spinner";
import { prisma } from "@/utils/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const createNewUser = async () => {
  const user = await currentUser();
  let match;

  if (user && user.id) {
    try {
      match = await prisma.user.findUnique({
        where: {
          clerkId: user.id,
        },
      });
    } catch (e) {
      console.log(e);
    }

    if (!match) {
      await prisma.user.create({
        data: {
          clerkId: user?.id,
          email: user?.emailAddresses[0].emailAddress,
        },
      });
    }
  }

  redirect("/");
};

const NewUserPage = async () => {
  await createNewUser();

  return <Spinner />;
};

export default NewUserPage;
