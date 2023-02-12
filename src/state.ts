import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import "isomorphic-fetch";
import { Redis } from '@upstash/redis'
import { customAlphabet } from 'nanoid';
import { Database } from '@/src/supabaseTypes';

import { User, SignupRequestBody, Question, QuestionStatus, MagicLink, TDateISO, Session, AddQuestionRequestBody, QuestionPool, QuestionPoolResponse, UpdateQuestionRequestBody } from "@/src/types";

const redis = new Redis({
  url: 'https://us1-ideal-man-39336.upstash.io',
  token: 'AZmoACQgOTNhY2YyNGEtZTFmOS00YzU1LWEyNmYtZGI4Nzc0OWEwZGNjODA1ODVlMDJhNmQ1NDZiYzhmOGE3YjhiZTdkMzI2MWI=',
})

const supabase = createClient<Database>(
  process.env.SUPABASE_PUBLIC_URL as string,
  process.env.SUPABASE_API_KEY as string
)

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

export const getUserByEmail = async (email: User['email']) : Promise<User|null>  => {
  const { data: users } = await supabase.from('users').select('*').eq('id', email);
  return users?.[0] || null;
}

export const getUser = async (userId: User['id']) : Promise<User|null>  => {
  // const user = await redis.get(getUserKey(userId)) as User | null;
  const { data: users } = await supabase.from('users').select('*').eq('id', userId);
  return users?.[0] || null;
}

export const addUser = async (newUser: SignupRequestBody) : Promise<User> => {
  const newUserPayload: User = {
    id: generateId(),
    signed_up_at: now().toISOString() as TDateISO,
    is_admin: false,
    ...newUser,
  };

  console.log('Attempting to add user', newUserPayload);

  const response = await supabase.from('users').insert(newUserPayload);
  console.log('New user response!', response);

  // await redis.set(getUserKey(newUserPayload.id), newUserPayload);
  // await redis.set(getUserIdLookupKey(newUserPayload.email), newUserPayload.id);

  return newUserPayload;
}

// const getMagicLinkKey = (magicLinkId: MagicLink['id']) => `magicLink:${magicLinkId}`;

export const generateMagicLink = async (user: User) => {
  const magicLink: MagicLink = {
    id: generateId(),
    created_at: now().toISOString(),
    user_id: user.id,
    expires_at: getNewExpiration(MAGICLINK_SESSION_EXPIRATION_TIMEDELTA)
  }

  await supabase.from('magic_links').insert(magicLink);

  return magicLink;
}

export const getMagicLink = async (magicLinkId: MagicLink['id']) : Promise<MagicLink | null> => {
  const { data: magicLinks } = await supabase.from('magic_links').select('*').eq('id', magicLinkId);
  return magicLinks?.[0] || null;
}

export const deleteMagicLink = async (magicLink: MagicLink) : Promise<void> => {
  console.log('Deleting magic link', magicLink);
  await supabase.from('magic_links').delete().eq('id', magicLink.id)
}

const getSessionKey = (sessionId: Session['id']) => `session:${sessionId}`;

export const getSession = async (sessionId: Session['id']) : Promise<Session | null> => {
  const { data: sessions } = await supabase.from('sessions').select('*').eq('id', sessionId);
  console.log('Getting session', sessions);
  return sessions?.[0] || null;
}

export const refreshSession = async (session: Session) : Promise<Session | null> => {
  const newSession : Session = {
    ...session,
    expires_at: getNewExpiration(SESSION_EXPIRATION_TIMEDELTA)
  };
  await supabase.from('sessions').update({expires_at: newSession.expires_at}).eq('id', session.id);
  // await redis.set(getSessionKey(newSession.id), newSession);
  return newSession;
}

export const createSession = async (user: User) : Promise<Session>=> {
  const newSession : Session = {
    id: generateId(),
    created_at: now().toISOString(),
    expires_at: getNewExpiration(SESSION_EXPIRATION_TIMEDELTA),
    user_id: user.id
  }
  await supabase.from('sessions').insert(newSession);
  // await redis.set(getSessionKey(newSession.id), newSession);
  return newSession;
}

const getQuestionKey = (questionId: Question['id']) => `questions:${questionId}`;

export const addQuestion = async (newQuestion: AddQuestionRequestBody) : Promise<Question> => {
  const id = generateId();
  const fullQuestion : Database['public']['Tables']['questions']['Insert'] = {
    ...newQuestion,
    id
  };
  console.log('Inserting question', fullQuestion);
  const response = await supabase.from('questions').insert(fullQuestion).select()
  console.log('Inserting question response', response);
  const insertedQuestion = (response.data as Question[])[0];
  return insertedQuestion;
}

export const updateQuestion = async (questionId: Question['id'], question: UpdateQuestionRequestBody) : Promise<Question> => {
  console.log('Updating question', question);
  const response = await supabase.from('questions').update(question).eq('id', questionId).select()
  console.log('Updating question response', response);
  const updatedQuestion = (response.data as Question[])[0];
  return updatedQuestion;
}

export const getQuestionPool = async () : Promise<QuestionPoolResponse> => {
  // await redis.set(getQuestionKey(id), fullQuestion);
  const { data : questionPools } = await supabase.from('question_pools').select('*').limit(1);
  const { data: questions } = await supabase.from('questions').select();
  return {
    ...(questionPools as QuestionPool[])[0],
    questions: questions as Question[],
  }
}
