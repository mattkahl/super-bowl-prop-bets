import type { NextApiRequest, NextApiResponse } from "next";

import { AddQuestionRequestBody, Question, UpdateQuestionRequestBody, User } from "@/src/types";
import { withAuthRequiredApiRoute } from "@/src/withAuthRequiredApiRoute";
import { addQuestion, updateQuestion } from "@/src/state";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default withAuthRequiredApiRoute(handler);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Question>
) {
  if (req.method === 'PATCH') {
    const question = req.body as UpdateQuestionRequestBody;
    const updatedQuestion = await updateQuestion(req.query.questionId as string, question);
    res.status(200).send(updatedQuestion);
  }
}
