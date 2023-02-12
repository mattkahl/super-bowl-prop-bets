import type { NextApiRequest, NextApiResponse } from "next";

import { AddQuestionRequestBody, Question, User } from "@/src/types";
import { withAuthRequiredApiRoute } from "@/src/withAuthRequiredApiRoute";
import { addQuestion } from "@/src/state";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default withAuthRequiredApiRoute(handler);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Question>
) {
  if (req.method === 'POST') {
    const newQuestion = req.body as AddQuestionRequestBody;
    const addedQuestion = await addQuestion(newQuestion);
    res.status(201).send(addedQuestion);
  }
}
