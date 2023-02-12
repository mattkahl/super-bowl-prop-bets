// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
import {
  Answer,
  QuestionStatus,
  ScoredSubmission,
  Submission,
} from "@/src/types";
import { Database } from "@/src/supabaseTypes";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.SUPABASE_PUBLIC_URL as string,
  process.env.SUPABASE_API_KEY as string
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { data: cacheRows } = await supabase.from("cache").select("*");

  const submissions = cacheRows?.[0].submissions as unknown as Submission[];
  const answers = cacheRows?.[0].answers as unknown as Answer[];

  const allSubmissions: Submission[] = submissions;
  const allAnswers: Answer[] = answers;
  let answersById = _.keyBy(allAnswers, "id");

  const scoredSubmissions: ScoredSubmission[] = [];

  for (const submission of allSubmissions) {
    let numberOfCorrectFinalAnswers = 0;
    let numberOfCorrectAvailableAnswers = 0;
    for (let answerId = 1; answerId <= allAnswers.length; answerId += 1) {
      const currentAnswer = answersById[answerId];
      if (currentAnswer.status === QuestionStatus.answerNotYetAvailable) {
        continue;
      }
      const isCorrect = submission[answerId] === currentAnswer.answer;
      if (isCorrect) {
        if (currentAnswer.status === QuestionStatus.answeredAndCouldChange) {
          numberOfCorrectAvailableAnswers += 1;
        }
        if (currentAnswer.status === QuestionStatus.finalAnswerEntered) {
          numberOfCorrectFinalAnswers += 1;
        }
      }
    }
    scoredSubmissions.push({
      ...submission,
      currentScore: numberOfCorrectFinalAnswers,
      tentativeScore: numberOfCorrectAvailableAnswers,
      currentPlace: "1",
      tentativePlace: "1",
    });
  }

  console.log("COUNT", scoredSubmissions.length);
  const tentativeScoreGroups = _.groupBy(scoredSubmissions, "tentativeScore");
  const currentScoreGroups = _.groupBy(scoredSubmissions, "currentScore");

  const allTentativeScores = _.uniq(
    scoredSubmissions.map((submission) => submission.tentativeScore)
  )
    .sort()
    .reverse();
  const allFinalScores = _.uniq(
    scoredSubmissions.map((submission) => submission.currentScore)
  )
    .sort()
    .reverse();

  for (const submission of scoredSubmissions) {
    submission.tentativePlace = String(
      allTentativeScores.indexOf(submission.tentativeScore) + 1
    );
    submission.currentPlace = String(
      allFinalScores.indexOf(submission.currentScore) + 1
    );

    if (tentativeScoreGroups[submission.tentativeScore].length > 1) {
      submission.tentativePlace = `T${submission.tentativePlace}`;
    }
    if (currentScoreGroups[submission.currentScore].length > 1) {
      submission.currentPlace = `T${submission.currentPlace}`;
    }
  }

  res.status(200).send({ scoredSubmissions, answers });
}
