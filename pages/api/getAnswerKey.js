const { getAnswerKey } = require("../../spreadsheets.js");

export default async function handler(req, res) {
  // const spreadsheetData = await getSubmissionsSpreadsheet();
  // const answersData = await getAnswerSpreadsheet();
  const answerKey = await getAnswerKey();

  res.status(200).json({
    answerKey,
  });
}
