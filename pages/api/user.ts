import type { NextApiRequest, NextApiResponse } from "next";

import { User } from "@/src/types";
import { withAuthRequiredApiRoute } from "@/src/withAuthRequiredApiRoute";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default withAuthRequiredApiRoute(handler);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User>
) {
  res.status(200).send(req.user as User);
}
