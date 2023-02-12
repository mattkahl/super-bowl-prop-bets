import type { NextApiRequest, NextApiResponse } from "next";

import { SignupRequestBody, User } from "@/src/types";
import { addUser, getUserByEmail } from "@/src/state";
import { sendLoginEmail } from "@/src/email";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User|object>
) {
  const body = req.body as SignupRequestBody;

  // // Check for existing user
  const existingUser = await getUserByEmail(body.email);

  console.log('Checking for existing user', body.email, existingUser);
  if (existingUser !== null) {
    res.status(409).send({ message: "User already exists. Try logging in." });
    return;
  }

  // Write user
  const newUser = await addUser(body);

  // Send email with login link
  await sendLoginEmail(newUser);

  res.status(201).send(newUser);
}
