import { ToastOptions } from "react-toastify";

type QuestionsDict = {
  [key: string]: string;
};

export const questionsDict: QuestionsDict = {
  "66d44daf598fba558c868f1a": "What are the key challenges that youths face?",
  "66d4730fb71154382575eef8":
    "Group all posts by category in descending order and provide a % breakdown",
  "66f7cb23aa0e750df917b2ee": "What are the top 3 most popular posts?",
  "66d44d905e53e4575d513fdc": "What are some time management tips?",
  "6838643efae0964b6e8e290a": "Give me the top 3 comments"
};

export const toastConfig: ToastOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  progress: undefined,
};
