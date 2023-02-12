import type { NextApiRequest, NextApiResponse } from "next";

import { MagicLink } from "@/src/types";
import { createSession, deleteMagicLink, getMagicLink, getUser } from "@/src/state";
import { decrypt } from "@/src/cryptr";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/src/session";

const magicLinkRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { encryptedMagicLinkId } = req.query as { encryptedMagicLinkId: MagicLink['id']};

  const magicLinkId = decrypt(encryptedMagicLinkId);

  console.log('Decrypted magic link id', magicLinkId);
  const magicLink = await getMagicLink(magicLinkId);

  const now = (new Date()).toISOString();
  if (magicLink === null || now > magicLink.expires_at) {
    console.log('Invalid magic link. Redirecting to login.', magicLink);

    if (magicLink !== null) {
      await deleteMagicLink(magicLink);
    }
    res.redirect(302, '/login');
    return;
  }

  const user = await getUser(magicLink.user_id);

  if (user === null) {
    console.error('User id in magic link not valid. Something is wrong.')
    res.redirect(302, '/login');
    return;
  }

  // Loggin in!
  const session = await createSession(user);
  req.session.session = session;
  await req.session.save();

  console.log('Login successful. Redirecting to dashboard.')
  res.redirect(302, '/dashboard');
}

export default withIronSessionApiRoute(magicLinkRoute, sessionOptions);
