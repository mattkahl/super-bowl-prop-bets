import { Database } from "./supabaseTypes";

// In TS, interfaces are "open" and can be extended
interface Date {
  /**
   * Give a more precise return type to the method `toISOString()`:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
   */
  toISOString(): TDateISO;
}

type TYear         = `${number}${number}${number}${number}`;
type TMonth        = `${number}${number}`;
type TDay          = `${number}${number}`;
type THours        = `${number}${number}`;
type TMinutes      = `${number}${number}`;
type TSeconds      = `${number}${number}`;
type TMilliseconds = `${number}${number}${number}`;

/**
 * Represent a string like `2021-01-08`
 */
type TDateISODate = `${TYear}-${TMonth}-${TDay}`;

/**
 * Represent a string like `14:42:34.678`
 */
type TDateISOTime = `${THours}:${TMinutes}:${TSeconds}.${TMilliseconds}`;

/**
 * Represent a string like `2021-01-08T14:42:34.678Z` (format: ISO 8601).
 *
 * It is not possible to type more precisely (list every possible values for months, hours etc) as
 * it would result in a warning from TypeScript:
 *   "Expression produces a union type that is too complex to represent. ts(2590)
 */
export type TDateISO = `${TDateISODate}T${TDateISOTime}Z`;


export type MagicLink = Database['public']['Tables']['magic_links']['Row'];

export type Session = Database['public']['Tables']['sessions']['Row'];

export enum QuestionStatus {
  answerNotYetAvailable = "answerNotYetAvailable",
  answeredAndCouldChange = "answeredAndCouldChange",
  finalAnswerEntered = "finalAnswerEntered",
}

export type Question = Database['public']['Tables']['questions']['Row'] & {
  choices: string[]
}

export type QuestionPool = Database['public']['Tables']['question_pools']['Row'];

export interface QuestionPoolResponse extends QuestionPool {
  questions: Question[]
}
export interface QuestionPoolSubmissionAnswer {
  question_id: Question["id"];
  answer: Question["answer"];
}

export interface QuestionPoolSubmission {
  created_at: TDateISO;
  submitted_at: TDateISO;
  answers: QuestionPoolSubmissionAnswer[];
  tiebreakerAnswer: string;
}

// export interface Tiebreaker {
//   status: QuestionStatus;
//   title: string;
//   content: string | null;
//   choices: string[];
//   answer: string | null;
//   isFinalized: boolean;
// }

// export interface QuestionPool {
//   id: string;
//   props: Question[];
//   isOpenForSubmissions: boolean;
//   tiebreaker: Tiebreaker;
// }

export type User = Database['public']['Tables']['users']['Row'];
export interface SignupRequestBody {
  email: User['email'],
  name: User['name']
}

export interface AddQuestionRequestBody extends Omit<Question, 'id'|'created_at'> {}
export interface UpdateQuestionRequestBody extends Question {}



export interface Submission {
  userEmail: string;
  userName: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  13: string;
  14: string;
  15: string;
  16: string;
  17: string;
  18: string;
  19: string;
  20: string;
  21: string;
  22: string;
  23: string;
  24: string;
  25: string;
  26: string;
  27: string;
  28: string;
  29: string;
  30: string;
  31: string;
  32: string;
  33: string;
  34: string;
  35: string;
  36: string;
  37: string;
  38: string;
  39: string;
  40: string;
  41: string;
  42: string;
  43: string;
  44: string;
  45: string;
  46: string;
  47: string;
  48: string;
  49: string;
  50: string;
  51: string;
  52: string;
  53: string;
  54: string;
  55: string;
  56: string;
  57: string;
  58: string;
  59: string;
  60: string;
  61: number;
}

export interface Answer {
  id: number;
  title: string;
  answer: string;
  status: string;
  isFinalized: string;
}

export interface ScoredSubmission extends Submission {
  currentScore: number,
  tentativeScore: number,
  currentPlace: string,
  tentativePlace: string,
}
