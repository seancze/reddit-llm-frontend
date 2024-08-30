"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export const Header = () => {
  const { data: session } = useSession();

  console.log({ session });

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="mx-auto px-8 py-2 flex justify-end text-sm">
          {session ? (
            <button
              className="
                bg-reddit-orange
                text-white
                font-bold
                py-2
                px-4
                rounded
                shadow-md
                hover:shadow-lg
                transition-all
                duration-300
                ease-in-out
                transform
                hover:scale-105
                flex
                items-center
              "
              onClick={() => signOut()}
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
              className="
                bg-reddit-orange
                text-white
                font-bold
                py-2
                px-4
                rounded
                shadow-md
                hover:shadow-lg
                transition-all
                duration-300
                ease-in-out
                transform
                hover:scale-105
                flex
                items-center
              "
              onClick={() => signIn("reddit")}
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
        </div>
      </header>
      <div className="h-12"></div>
      {/* spacer to prevent content from going under the fixed header */}
    </>
  );
};
