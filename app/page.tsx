import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  let href = userId ? "/journal" : "/new-user";
  return (
    <main className="h-screen w-screen flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-[600px] mx-auto">
        <h1 className="text-6xl mb-4">The best journal app, period</h1>
        <p className="text-2xl text-white/60">
          This is best app to create journal and being mood analysis
        </p>

        <div>
          <Link href={href}>
            <button className="bg-blue-600 px-4 py-2 rounded-lg text-xl">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
