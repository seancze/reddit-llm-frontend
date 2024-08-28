import React from "react";
import Image from "next/image";

export const Header = () => {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="max-w-3xl mx-auto px-4 py-2 flex justify-end">
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
            onClick={() => {
              /* Add Reddit login logic here */
            }}
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
        </div>
      </header>
      <div className="h-12"></div>{" "}
      {/* spacer to prevent content from going under the fixed header */}
    </>
  );
};
