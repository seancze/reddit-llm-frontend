import { useSession, signIn } from "next-auth/react";

export const Description: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="text-center">
      <h1 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2">
        Your Reddit questions, answered
      </h1>
      <p className="text-sm sm:text-lg md:text-xl">
        Click a question below
        {!session ? (
          <>
            {" or "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                signIn("reddit");
              }}
              className="text-cyan-500 hover:text-cyan-400 underline"
            >
              login with Reddit
            </a>
            {" to ask your own question"}
          </>
        ) : (
          " or ask your own question"
        )}
      </p>
    </div>
  );
};
