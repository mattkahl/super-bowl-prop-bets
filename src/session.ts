// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from 'iron-session'
import type { Session } from '@/src/types'

export const sessionOptions: IronSessionOptions = {
  password: process.env.ENCRYPTION_SECRET as string,
  cookieName: 'kahlsbprops2023',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    session: Session,
  }
}
