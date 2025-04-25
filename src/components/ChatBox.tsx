import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

interface ChatBoxProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isChatOwner: boolean;
}

const validationSchema = Yup.object().shape({
  message: Yup.string()
    .min(10, "Question must be at least 10 characters")
    .required("Question is required"),
});

export const ChatBox: React.FC<ChatBoxProps> = ({
  onSend,
  isLoading,
  isChatOwner,
}: ChatBoxProps) => {
  const { data: session } = useSession();

  const handleSubmit = async (
    values: { message: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    if (values.message.trim() && !isLoading && session) {
      // reset the form first to clear the input field in the frontend
      resetForm();
      await onSend(values.message);
    }
  };

  const isDisabled = !(session && isChatOwner);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
      <Formik
        initialValues={{ message: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isValid, dirty }) => (
          <Form className="w-full max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <Field
                type="text"
                name="message"
                className={`w-full px-4 py-3 pr-12 border border-gray-600 rounded-full focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                ${
                  isDisabled
                    ? "cursor-not-allowed bg-gray-700"
                    : "text-white bg-gray-800"
                }
                ${errors.message && touched.message ? "border-red-500" : ""}`}
                placeholder={
                  !session
                    ? "Login to ask your own question"
                    : !isChatOwner
                    ? "Start your own chat to ask a question"
                    : "Type your question here..."
                }
                disabled={isDisabled}
              />
              <button
                type="submit"
                className={`absolute right-2 p-2 text-white rounded-full focus:outline-hidden focus:ring-2 focus:ring-blue-400
                ${
                  isDisabled
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-cyan-700"
                }`}
                // NOTE: we do not disable the button if the input is invalid (i.e. !isValid || !dirty)
                // this is done so that the user can still submit the form which will trigger the display of the error message
                disabled={isDisabled}
              >
                <FaPaperPlane className="w-5 h-5" />
              </button>
            </div>
            {errors.message && touched.message && (
              <div className="text-red-500 text-sm mt-1">{errors.message}</div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
