import { create } from "zustand";
import { Question, SignupRequestBody, User } from "./types";
import axios, { AxiosResponse, AxiosError } from "axios";

interface ClientState {
  activeUser: User | null;
  isSignupInProgress: boolean;
  signupSuccessMessage: string | null;
  signupErrorMessage: string | null;
  loginErrorMessage: string | null;
  isLoginInProgress: boolean;
  attemptSignup: (data: SignupRequestBody) => Promise<void>;
  questions: null | Question[];
  addQuestion: (newQuestion: Omit<Question, "id">) => Promise<void>;
  refreshQuestions: () => Promise<void>;
  // editQuestion: (editedQuestion: Question) => Promise<Question>;
}

export const useStore = create<ClientState>((set, get) => ({
  activeUser: null,
  isSignupInProgress: false,
  signupSuccessMessage: null,
  signupErrorMessage: null,
  loginErrorMessage: null,
  isLoginInProgress: false,
  questions: null,
  initPage: () => {},
  addQuestion: async (newQuestion) => {
    await axios.post<Question>("/api/questions", {
      data: newQuestion
    });
    await get().refreshQuestions();
  },
  refreshQuestions: async () => {
    const response = await axios.get<Question[]>("/api/questions");
    set({questions: response.data});
  },
  attemptSignup: async (data) => {
    if (!(data.email && data.name)) {
      set({
        signupErrorMessage: "Please fill out all required fields.",
      });
      return;
    }

    set({
      isSignupInProgress: true,
      signupSuccessMessage: null,
      signupErrorMessage: null,
    });

    try {
      await axios.post<
        SignupRequestBody,
        AxiosResponse<User | { message: string }>,
      >("/api/signup", data);
      set({
        signupSuccessMessage:
          "🎉 An email has been sent to you with a login link!",
      });
    } catch (err: unknown | AxiosError) {
      console.error("Error signing up", err);
      if (axios.isAxiosError(err)) {
        if (err?.response?.status === 409) {
          set({ signupErrorMessage: err.response.data.message });
        }
      } else {
        set({
          signupErrorMessage: `An unknown error has occurred. Please try again.`,
        });
      }
    } finally {
      set({ isSignupInProgress: false });
    }
  },
}));
