"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="z-10 border-b">
      <div className="mx-auto flex items-center justify-end md:justify-between px-8 py-2 text-sm">
        <span className="text-lg font-semibold hidden md:block">
          ChatGPT For SGExams
        </span>

        <div className="flex items-center">
          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-reddit-orange text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <Image
                src="/reddit.svg"
                alt="Reddit logo"
                width={20}
                height={20}
                className="mr-2 inline-block"
              />
              Logout
            </button>
          ) : (
            <button
              onClick={() => signIn("reddit")}
              className="bg-reddit-orange text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <Image
                src="/reddit.svg"
                alt="Reddit logo"
                width={20}
                height={20}
                className="mr-2 inline-block"
              />
              Login with Reddit
            </button>
          )}
          <div className="ml-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
