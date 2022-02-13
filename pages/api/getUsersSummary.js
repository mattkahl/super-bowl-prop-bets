const { getUsersSummary } = require("../../spreadsheets.js");

export default async function handler(req, res) {
  // const spreadsheetData = await getSubmissionsSpreadsheet();
  // const answersData = await getAnswerSpreadsheet();
  const usersSummary = await getUsersSummary();

  res.status(200).json(usersSummary);
}
