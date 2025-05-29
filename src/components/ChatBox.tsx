"use client";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/components/ui/kibo-ui/ai/input";
import { SendIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";

interface ChatBoxProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isChatOwner: boolean;
}

const validationSchema = Yup.object().shape({
  query: Yup.string().min(10, "Question must be at least 10 characters"),
});

export const ChatBox: React.FC<ChatBoxProps> = ({
  onSend,
  isLoading,
  isChatOwner,
}: ChatBoxProps) => {
  const { data: session } = useSession();

  const handleSubmit = async (
    values: { query: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    if (values.query.trim() && !isLoading && session) {
      // reset the form first to clear the input field in the frontend
      resetForm();
      await onSend(values.query);
    }
  };

  const isDisabled = !(session && isChatOwner && !isLoading);
  return (
    <Formik
      initialValues={{ query: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <>
          <AIInput
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit(e);
            }}
          >
            <AIInputTextarea
              name="query"
              value={formik.values.query}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isDisabled}
              placeholder={
                !session
                  ? "Login to ask a question"
                  : !isChatOwner
                  ? "Start your own chat to ask a question"
                  : "Type your question here..."
              }
            />
            <AIInputToolbar>
              <AIInputTools />
              {/* // NOTE: we do not disable the button if the input is invalid (i.e. !isValid || !dirty)
                // this is done so that the user can still submit the form which will trigger the display of the error message */}
              <AIInputSubmit disabled={isDisabled}>
                <SendIcon size={16} />
              </AIInputSubmit>
            </AIInputToolbar>
          </AIInput>
          <ErrorMessage name="query">
            {(msg) => {
              return (
                <p className="text-red-500 text-sm text-right" role="alert">
                  {msg}
                </p>
              );
            }}
          </ErrorMessage>
        </>
      )}
    </Formik>
  );
};
