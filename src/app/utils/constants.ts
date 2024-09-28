import { ToastOptions } from "react-toastify";

type QuestionsDict = {
  [key: string]: string;
};

export const questionsDict: QuestionsDict = {
  "66d44daf598fba558c868f1a": "What are the key challenges that youths face?",
  "66d4730fb71154382575eef8":
    "Group all posts by category in descending order and provide a % breakdown",
  "66d43353b0d46599ed963670": "What are the top 3 most popular posts?",
  "66d44d905e53e4575d513fdc": "What are some time management tips?",
};

export const toastConfig: ToastOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  progress: undefined,
};
