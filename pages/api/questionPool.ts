import type { NextApiRequest, NextApiResponse } from "next";

import { AddQuestionRequestBody, Question, QuestionPoolResponse, User } from "@/src/types";
import { withAuthRequiredApiRoute } from "@/src/withAuthRequiredApiRoute";
import { addQuestion, getQuestionPool } from "@/src/state";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default withAuthRequiredApiRoute(handler);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuestionPoolResponse>
) {
  if (req.method === 'GET') {
    const questionPool = await getQuestionPool();
    res.status(201).send(questionPool);
  }
}
