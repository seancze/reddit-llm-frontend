"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { FaArrowLeft } from "react-icons/fa";
import { Logo } from "@/components/Logo";
import { Description } from "@/components/Description";
import { ExampleQuestions } from "@/components/ExampleQuestions";
import { ChatBox } from "@/components/ChatBox";
import { ChatHistory } from "@/components/ChatHistory";
import { Message } from "@/types/message";
import { FeedbackButtons } from "@/components/FeedbackButtons";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showInitialContent, setShowInitialContent] = useState(true);

  useEffect(() => {
    if (messages.length > 0) {
      setShowInitialContent(false);
    }
  }, [messages]);

  const handleSendMessage = (message: string) => {
    setMessages([
      { type: "user", content: message },
      {
        type: "bot",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu facilisis tortor. Nulla ex libero, dapibus vel nulla ac, suscipit condimentum velit. Cras sodales vehicula magna vitae porta. Sed eget pulvinar sem, id tristique ligula. Quisque sodales nulla non orci facilisis, eget rhoncus ex mattis. Praesent eros diam, mollis eu orci et, facilisis volutpat justo. Nunc in velit ut sapien pretium consequat. Proin scelerisque nisl sit amet pellentesque tincidunt. Cras hendrerit arcu nibh. Curabitur magna urna, ultrices ac quam non, sodales venenatis dolor. Suspendisse ac dignissim magna. Ut ut leo vel elit laoreet ultrices. Aenean condimentum ipsum at nisi pulvinar rutrum. Pellentesque pellentesque volutpat dui, quis suscipit arcu. Morbi viverra felis eget neque placerat, nec volutpat velit tincidunt.
\n
\nProin varius, enim fringilla ultrices faucibus, arcu dui tincidunt felis, sed rhoncus velit enim eu eros. Cras convallis lacus id eros tincidunt, id vulputate lacus posuere. Pellentesque sodales egestas vehicula. Suspendisse ut lacus sit amet ex vulputate rhoncus. Nullam luctus ipsum consequat magna venenatis ultricies. Nullam in eros elit. Integer aliquet, metus eu sagittis ullamcorper, felis mi porta lacus, et rhoncus felis sem non velit. Ut dapibus faucibus risus eget venenatis. Nam quam augue, eleifend at lectus quis, pretium rutrum dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In interdum in nisl id fermentum. Donec leo elit, auctor nec augue egestas, viverra placerat elit. Donec mollis est ut turpis semper, ac pharetra purus varius. Nulla sit amet convallis ex. Suspendisse potenti.
\n
\nNunc ornare augue quam, non consequat leo sagittis a. Duis viverra neque quis urna tempor, eu faucibus purus lobortis. Ut in pretium arcu. Integer lorem nisl, consectetur a varius sed, consectetur at odio. Aliquam fermentum ipsum a urna venenatis, vitae finibus purus pretium. Donec dolor erat, dignissim id ullamcorper nec, condimentum id leo. Nullam dictum tellus ante, sagittis sodales velit convallis dapibus. Donec condimentum sem tellus, sit amet ullamcorper lorem aliquam eu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse bibendum mattis orci, quis volutpat sapien hendrerit nec. Nullam feugiat lectus nec neque viverra, non porttitor quam gravida. Nullam porta, sapien eget ultricies pellentesque, metus quam porta diam, a interdum nibh est eget nisl. Suspendisse a lacus mattis, pharetra nunc vel, tempus metus. Nulla felis risus, maximus sed purus quis, gravida interdum quam. Nunc vitae ligula consectetur, sodales enim quis, rhoncus est. Sed elementum interdum ante, nec fringilla ipsum tincidunt a.
\n
\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce imperdiet nibh id nibh vehicula, sagittis cursus purus varius. Phasellus vel nulla vel sapien tempor aliquam. Ut libero nisl, hendrerit eu lobortis eget, ornare quis erat. Nullam augue felis, aliquam et dui ac, feugiat dapibus ipsum. Curabitur sit amet sem aliquet leo gravida scelerisque nec eu ligula. Duis volutpat est at massa laoreet, fermentum elementum quam accumsan. Nullam sit amet hendrerit lacus.
\n
\nSuspendisse sit amet efficitur mauris. Quisque tempus sit amet nibh ac consequat. Vestibulum vel nibh ac magna tincidunt vehicula. Morbi efficitur dolor id vulputate dictum. Fusce libero mi, vestibulum a lacinia ut, suscipit quis elit. Nunc varius, eros a placerat vestibulum, nunc diam pretium mi, eu tempus diam diam non purus. Nam vitae dictum dolor.`,
      },
    ]);
  };

  const handleBackClick = () => {
    setShowInitialContent(true);
    setMessages([]);
    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-between sm:py-12">
      <Head>
        <title>Climate Chat AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-3 sm:max-w-3xl sm:mx-auto w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-3xl mx-auto">
            {!showInitialContent && (
              <button
                onClick={handleBackClick}
                className="mb-6 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Back to start"
              >
                <FaArrowLeft className="w-6 h-6" />
              </button>
            )}
            {showInitialContent && (
              <>
                <Logo />
                <Description />
                <ExampleQuestions onQuestionClick={handleSendMessage} />
              </>
            )}
            <ChatHistory messages={messages} />
            {messages.length > 0 && <FeedbackButtons />}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <ChatBox
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
