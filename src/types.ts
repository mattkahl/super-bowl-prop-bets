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


export interface MagicLink {
  id: string;
  userId: string;
  expireAt: TDateISO;
}

export interface Session {
  id: string;
  userId: string;
  expireAt: TDateISO;
}

export enum QuestionStatus {
  answerNotYetAvailable = "answerNotYetAvailable",
  answeredAndCouldChange = "answeredAndCouldChange",
  finalAnswerEntered = "finalAnswerEntered",
}

export interface Question {
  id: string;
  status: QuestionStatus;
  title: string;
  content: string | null;
  choices: string[];
  answer: string | null;
  isFinalized: boolean;
}

export interface QuestionPoolSubmissionAnswer {
  propId: Question["id"];
  answer: Question["answer"];
}

export interface QuestionPoolSubmission {
  user: User["id"];
  pool: QuestionPool["id"];
  submittedAt: TDateISO;
  modifiedAt: TDateISO;
  propAnswers: QuestionPoolSubmissionAnswer[];
  tiebreakerAnswer: Tiebreaker["answer"];
}

export interface Tiebreaker {
  status: QuestionStatus;
  title: string;
  content: string | null;
  choices: string[];
  answer: string | null;
  isFinalized: boolean;
}

export interface QuestionPool {
  id: string;
  props: Question[];
  isOpenForSubmissions: boolean;
  tiebreaker: Tiebreaker;
}

export interface User {
  id: string;
  email: string;
  name: string;
  signedUpAt: TDateISO;
  isAdmin: boolean;
}

export interface SignupRequestBody {
  email: User['email'],
  name: User['name']
}

export interface AddQuestionRequestBody extends Omit<Question, 'id'> {}
