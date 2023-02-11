// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";
import { sessionOptions } from "@/src/session";
import { getSession, getUser } from "./src/state";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  const ironSession = await getIronSession(req, res, sessionOptions);

  if (!ironSession?.session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const session = await getSession(ironSession.session.id);
  if (session === null) {
    console.error('Session not found. Denying access.', session);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (session.expireAt < (new Date()).toISOString()) {
    console.error('Session expired. Denying access.', session);
    ironSession.destroy();
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const user = await getUser(session.userId);

  if (user === null) {
    console.error('User not found. Denying access.', session);
    ironSession.destroy();
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
};

export const config = {
  matcher: ['/((?!api|login|_next/static|_next/image|favicon.ico).*)'],
};
