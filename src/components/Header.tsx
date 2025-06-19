"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onBackClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBackClick }) => {
  const { data: session } = useSession();

  return (
    // adapted from: https://ui.shadcn.com/blocks (components/site-header.tsx)
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {session && (
          <>
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </>
        )}
        <Button
          variant={"ghost"}
          onClick={onBackClick}
          // pl-0 and hover:bg-transparent is used to remove default styling that comes with the Button component
          className="text-xs md:text-base font-medium cursor-pointer pl-0 hover:bg-transparent!"
        >
          ChatGPT For SGExams
        </Button>

        <div className="ml-auto flex items-center">
          {session ? (
            <Button
              onClick={() => signOut()}
              className="bg-reddit-orange text-white hover:bg-reddit-orange-dark font-bold rounded shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <Image
                src="/reddit.svg"
                alt="Reddit logo"
                width={20}
                height={20}
                className="inline-block"
              />
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => signIn("reddit")}
              className="bg-reddit-orange text-white hover:bg-reddit-orange-dark font-bold rounded shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <Image
                src="/reddit.svg"
                alt="Reddit logo"
                width={20}
                height={20}
                className="inline-block"
              />
              Login with Reddit
            </Button>
          )}
          <div className="ml-2 md:ml-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
