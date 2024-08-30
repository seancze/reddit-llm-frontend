import React, { useState, useEffect, KeyboardEvent } from "react";
import { FaArrowLeft, FaSpinner, FaEdit, FaCheck } from "react-icons/fa";
import { FeedbackButtons } from "@/components/FeedbackButtons";
import { Message } from "@/types/message";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useSession } from "next-auth/react";

interface ChatInterfaceProps {
  queryId: string;
  messages: Message[];
  isLoading: boolean;
  onBackClick: () => void;
  onSendMessage: (message: string) => void;
  currentVote: -1 | 0 | 1;
  setCurrentVote: React.Dispatch<React.SetStateAction<-1 | 0 | 1>>;
}

const validationSchema = Yup.object().shape({
  question: Yup.string()
    .min(10, "Question must be at least 10 characters long")
    .required("Question is required"),
});

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  queryId,
  messages,
  isLoading,
  onBackClick,
  onSendMessage,
  currentVote,
  setCurrentVote,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (messages.length > 0 && messages[0].type === "user") {
      setInitialQuestion(messages[0].content);
    }
  }, [messages]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (
    values: { question: string },
    { setSubmitting }: FormikHelpers<{ question: string }>
  ) => {
    if (values.question !== messages[0].content) {
      onSendMessage(values.question);
    }
    setIsEditing(false);
    setSubmitting(false);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>,
    submitForm: () => void
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitForm();
    }
  };

  const urlTransform = (href: string) => href;

  const components = {
    a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-600 hover:underline"
        {...props}
      />
    ),
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-grow overflow-auto">
        <div className="relative max-w-4xl mx-auto w-full px-4 py-6">
          <button
            onClick={onBackClick}
            className={`${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-600"
            } mb-4 p-2 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 shadow-md`}
            aria-label="Back to start"
            disabled={isLoading}
          >
            <FaArrowLeft className="w-6 h-6" />
          </button>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-md ${
                  message.type === "user"
                    ? "bg-cyan-50 text-cyan-900"
                    : "bg-white text-gray-800 border border-cyan-200"
                }`}
              >
                {message.type === "user" && index === 0 ? (
                  <Formik
                    initialValues={{ question: initialQuestion }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting, isValid, submitForm }) => (
                      <Form>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">Question:</p>
                          {session && isEditing ? (
                            <button
                              type="submit"
                              className="text-cyan-600 hover:text-cyan-700"
                              disabled={isSubmitting || !isValid}
                            >
                              <FaCheck
                                className={`w-5 h-5 ${
                                  !isValid || isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              />
                            </button>
                          ) : (
                            session && (
                              <button
                                onClick={handleEditClick}
                                className="text-cyan-600 hover:text-cyan-700"
                              >
                                <FaEdit className="w-5 h-5" />
                              </button>
                            )
                          )}
                        </div>
                        {isEditing ? (
                          <div>
                            <Field name="question">
                              {({ field }: { field: any }) => (
                                <textarea
                                  {...field}
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, submitForm)
                                  }
                                  className="w-full p-2 border border-cyan-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  rows={3}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="question"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                        ) : (
                          <ReactMarkdown
                            className="prose max-w-none prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline"
                            remarkPlugins={[remarkGfm]}
                            urlTransform={urlTransform}
                            components={components}
                          >
                            {message.content}
                          </ReactMarkdown>
                        )}
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <>
                    <p className="font-medium mb-1">
                      {message.type === "user" ? "Question:" : "Response:"}
                    </p>
                    <ReactMarkdown
                      className="prose max-w-none prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline"
                      remarkPlugins={[remarkGfm]}
                      urlTransform={urlTransform}
                      components={components}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </>
                )}
              </div>
            ))}
          </div>
          {isLoading && (
            <div className="flex justify-center items-center my-4">
              <FaSpinner className="animate-spin text-cyan-500 text-4xl" />
            </div>
          )}
          {!isLoading && session && messages.length === 2 && (
            <FeedbackButtons
              queryId={queryId}
              currentVote={currentVote}
              setCurrentVote={setCurrentVote}
            />
          )}
        </div>
      </main>
    </div>
  );
};
