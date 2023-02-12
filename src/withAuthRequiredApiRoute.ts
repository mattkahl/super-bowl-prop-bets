import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "src/session";
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession, getUser } from "./state";
import { User } from "./types";

declare module "http" {
  interface IncomingMessage {
    user?: User;
  }
}
export const withAuthRequiredApiRoute = (
  handler: NextApiHandler
): NextApiHandler => {
  return withIronSessionApiRoute(async function nextApiHandlerWrappedWithIronSession(req, res) {
    if (!req.session?.session) {
      res.status(403).send({});
      return;
    }

    const session = await getSession(req.session.session.id);
    if (session === null) {
      console.error('Session not found. Denying access.', session);
      res.status(403).send({});
      return;
    }

    if (session.expires_at < (new Date()).toISOString()) {
      console.error('Session expired. Denying access.', session);
      req.session.destroy();
      res.status(403).send({});
      return;
    }

    const user = await getUser(session.user_id);

    if (user === null) {
      console.error('User not found. Denying access.', session);
      req.session.destroy();
      res.status(403).send({});
      return;
    }

    req.user = user;

    return handler(req, res);
  }, sessionOptions);
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withAuthRequiredApiRouteSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return withIronSessionSsr(handler, sessionOptions);
}



export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse<User>) {
  if (!req.session) {
    res.status(403).send({});
  }
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      ...req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
      login: "",
      avatarUrl: "",
    });
  }
}
