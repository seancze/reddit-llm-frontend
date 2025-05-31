"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onBackClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBackClick }) => {
  const { data: session } = useSession();

  return (
    <header className="z-10 border-b shadow-lg">
      <div className="mx-auto flex items-center justify-end md:justify-between px-4 md:px-8 py-2 text-sm">
        <Button
          variant={"ghost"}
          onClick={onBackClick}
          className="text-lg font-semibold hidden md:block cursor-pointer"
        >
          ChatGPT For SGExams
        </Button>

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
