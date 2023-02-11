import "isomorphic-fetch";
import { Redis } from '@upstash/redis'
import { customAlphabet } from 'nanoid';

import { User, SignupRequestBody, Question, QuestionStatus, MagicLink, TDateISO, Session, AddQuestionRequestBody } from "@/src/types";

const redis = new Redis({
  url: 'https://us1-ideal-man-39336.upstash.io',
  token: 'AZmoACQgOTNhY2YyNGEtZTFmOS00YzU1LWEyNmYtZGI4Nzc0OWEwZGNjODA1ODVlMDJhNmQ1NDZiYzhmOGE3YjhiZTdkMzI2MWI=',
})

const SESSION_EXPIRATION_TIMEDELTA = 14;
const MAGICLINK_SESSION_EXPIRATION_TIMEDELTA = 1;

const nanoid = customAlphabet('1234567890abcdef', 10);
const generateId = () => nanoid();
const now = () => (new Date());
const getNewExpiration = (timeDeltaInDays: number) : TDateISO => {
  const dateInFuture = new Date(now().getTime() + timeDeltaInDays * 24 * 60 * 60 * 1000);
  return dateInFuture.toISOString() as TDateISO;
}

const getUserIdLookupKey = (email: User['email']) => `userIdLookup:${email}`;
const getUserKey = (userId: User['id']) => `user:${userId}`;

export const lookupUserId = async (email: User['email']) : Promise<User['id']|null>  => {
  const userId = await redis.get(getUserIdLookupKey(email)) as User['id'] | null;
  return userId;
}

export const getUser = async (userId: User['id']) : Promise<User|null>  => {
  const user = await redis.get(getUserKey(userId)) as User | null;
  return user;
}

export const addUser = async (newUser: SignupRequestBody) : Promise<User> => {
  const newUserPayload: User = {
    id: generateId(),
    signedUpAt: now().toISOString() as TDateISO,
    isAdmin: false,
    ...newUser,
  };

  console.log('Attempting to add user', newUserPayload);
  await redis.set(getUserKey(newUserPayload.id), newUserPayload);
  await redis.set(getUserIdLookupKey(newUserPayload.email), newUserPayload.id);
  return newUserPayload;
}

const getMagicLinkKey = (magicLinkId: MagicLink['id']) => `magicLink:${magicLinkId}`;

export const generateMagicLink = async (user: User) => {
  const magicLink: MagicLink = {
    id: generateId(),
    userId: user.id,
    expireAt: getNewExpiration(MAGICLINK_SESSION_EXPIRATION_TIMEDELTA)
  }
  await redis.set(getMagicLinkKey(magicLink.id), magicLink);
  return magicLink as MagicLink;
}

export const getMagicLink = async (magicLinkId: MagicLink['id']) : Promise<MagicLink | null> => {
  const magicLink = await redis.get(getMagicLinkKey(magicLinkId)) as MagicLink | null;
  return magicLink;
}

export const deleteMagicLink = async (magicLink: MagicLink) : Promise<void> => {
  console.log('Deleting magic link', magicLink);
  await redis.del(getMagicLinkKey(magicLink.id));
}

const getSessionKey = (sessionId: Session['id']) => `session:${sessionId}`;

export const getSession = async (sessionId: Session['id']) : Promise<Session | null> => {
  const session = await redis.get(getSessionKey(sessionId)) as Session | null;
  return session;
}

export const refreshSession = async (session: Session) : Promise<Session | null> => {
  const newSession : Session = {
    ...session,
    expireAt: getNewExpiration(SESSION_EXPIRATION_TIMEDELTA)
  };
  await redis.set(getSessionKey(newSession.id), newSession);
  return newSession;
}

export const createSession = async (user: User) : Promise<Session>=> {
  const newSession : Session = {
    id: generateId(),
    expireAt: getNewExpiration(SESSION_EXPIRATION_TIMEDELTA),
    userId: user.id
  }
  await redis.set(getSessionKey(newSession.id), newSession);
  return newSession;
}

const getQuestionKey = (questionId: Question['id']) => `questions:${questionId}`;

export const addQuestion = async (newQuestion: AddQuestionRequestBody) : Promise<Question> => {
  const id = generateId();
  const fullQuestion : Question = {
    ...newQuestion,
    id
  };
  await redis.set(getQuestionKey(id), fullQuestion);
  return fullQuestion;
}

export const questions: Question[] = [
  {
    id: "1",
    status: QuestionStatus.answerNotYetAvailable,
    title: "How long will it take for Mickey Guyton to sing the national anthem?",
    content: null,
    isFinalized: false,
    choices: ["Under 1m35.5s", "Over 1m35.5s"],
    answer: null,
  },
  {
    id: "2",
    status: QuestionStatus.answerNotYetAvailable,
    title:
      "What will the primary color of Mickey Guyton's dress be during the national anthem?",
    content: null,
    isFinalized: false,
    choices: ["White", "Red", "Yellow", "Black", "Gold", "Blue", "Orange", "Purple", "Green", "Brown"],
    answer: null,
  },
  {
    id: "3",
    status: QuestionStatus.answerNotYetAvailable,
    title: "Which coach will be shown first during the National Anthem?",
    content: null,
    isFinalized: false,
    choices: ["Sean McVay (Rams)", "Zac Taylor (Bengals)"],
    answer: null,
  },
  {
    id: "4",
    status: QuestionStatus.answerNotYetAvailable,
    title:
      "Which quarterback will be shown first during the National Anthem?",
    content: null,
    isFinalized: false,
    choices: ["Joe Burrow (Bengals)", "Matthew Stafford (Rams)"],
    answer: null,
  },
  {
    id: "5",
    status: QuestionStatus.answerNotYetAvailable,
    title:
      "🫰🪙 What will the result of the coin toss be?",
    content: null,
    isFinalized: false,
    choices: ["Heads", "Tails"],
    answer: null,
  },
  {
    id: "6",
    status: QuestionStatus.answerNotYetAvailable,
    title:
      "Will the team who calls the coin toss be correct?",
    content: null,
    isFinalized: false,
    choices: ["Yes", "No"],
    answer: null,
  },
  {
    id: "7",
    status: QuestionStatus.answerNotYetAvailable,
    title:
      "Which Anheuser-Busch brand commercial will play first?",
    content: null,
    isFinalized: false,
    choices: ["Budweiser", "Bud Light Next", "Michelob Ultra", "Cutwater Spirits", "Bud Light Seltzer Hard Soda", "Michelob Ultra Organic Seltzer"],
    answer: null,
  },
  {
    id: "8",
    status: QuestionStatus.answerNotYetAvailable,
    title:
      "Which of these commercials will play first?",
    content: null,
    isFinalized: false,
    choices: ["Meta", "Amazon Prime", "Google"],
    answer: null,
  },
  {
    id: "9",
    status: QuestionStatus.answerNotYetAvailable,
    title:
      "Who will win Puppy Bowl XVIII?",
    content: null,
    isFinalized: false,
    choices: ["Team Fluff", "Team Ruff"],
    answer: null,
  },
  {
    id: "10",
    status: QuestionStatus.answerNotYetAvailable,
    title:
      "Will the Puppy Bowl MVP be a male or female?",
    content: null,
    isFinalized: false,
    choices: ["Male", "Female"],
    answer: null,
  },
  {
    id: "11",
    status: QuestionStatus.answerNotYetAvailable,
    title:
      "What letter will the Puppy Bowl MVP’s name begin with?",
    content: null,
    isFinalized: false,
    choices: ["A-H", "I-Q", "R-Z"],
    answer: null,
  },
];
