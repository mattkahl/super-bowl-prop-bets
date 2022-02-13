const Redis = require("ioredis");

const { google } = require("googleapis");

const sheets = google.sheets('v4');

const SPREADSHEET_ID = '1uTFqNy1qfN0LmAVQKDoDum_a8fuFW5EL_zZoEqTSBdg';

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

let _authToken;
async function getAuthToken() {
  if (_authToken) {
    return _authToken;
  }
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
  });
  _authToken = await auth.getClient();
  return _authToken;
}

async function getSpreadSheet({spreadsheetId, auth}) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

async function getSpreadSheetValues({spreadsheetId, auth, sheetName}) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName
  });
  return res;
}

async function getSubmissionsSpreadsheet() {
  const auth = await getAuthToken();

  let client = new Redis("redis://:49c6affabf0d498592fa3a7b21f4749b@us1-trusty-drum-35975.upstash.io:35975");
  const cacheHit = await client.get('2022Submissions');
  let spreadsheetData;

  if (cacheHit) {
    const parsedCacheHit = JSON.parse(cacheHit);
    const now = new Date();
    // Is newer than 2 minutes
    if (now - new Date(parsedCacheHit.updatedAt) < 120 * 1000) {
      console.log('Using cache hit.')
      spreadsheetData = parsedCacheHit.data;
    } else {
      console.log('Cache is expired.')
    }
  }

  if (!spreadsheetData) {
    console.log('Fetching submissions.')
    const response = await getSpreadSheetValues({ spreadsheetId: SPREADSHEET_ID, auth, sheetName: 'Submissions'});
    spreadsheetData = response.data;

    await client.set('2022Submissions', JSON.stringify({
      updatedAt: new Date(),
      data: response.data
    }))
  }
  return spreadsheetData;
}

async function getAnswerSpreadsheet() {
  const auth = await getAuthToken();

  let client = new Redis("redis://:49c6affabf0d498592fa3a7b21f4749b@us1-trusty-drum-35975.upstash.io:35975");
  const cacheHit = await client.get('2022Answers');
  let spreadsheetData;

  if (cacheHit) {
    const parsedCacheHit = JSON.parse(cacheHit);
    const now = new Date();
    // Is newer than 2 minutes
    if (now - new Date(parsedCacheHit.updatedAt) < 60 * 1000) {
      console.log('Using cache hit.')
      spreadsheetData = parsedCacheHit.data;
    } else {
      console.log('Cache is expired.')
    }
  }

  if (!spreadsheetData) {
    console.log('Fetching answers.')
    const response = await getSpreadSheetValues({ spreadsheetId: SPREADSHEET_ID, auth, sheetName: 'Answers'});
    spreadsheetData = response.data;

    await client.set('2022Answers', JSON.stringify({
      updatedAt: new Date(),
      data: spreadsheetData
    }));
  }
  return spreadsheetData;
}

export const getAnswerKey = async () => {
  const spreadsheetData = await getAnswerSpreadsheet();
  let answerKey = {};

  for (const [index, row] of spreadsheetData.values.entries()) {
    if (index < 3) {
      continue;
    }
    const [question, answer, isFinalizedRaw] = row;
    answerKey[index] = {
      question: question,
      answer: answer,
      isFinalized: isFinalizedRaw === 'Y'
    }
  }

  return answerKey;
}

export const getUsersSummary = async () => {
  const answerKey = await getAnswerKey();

  const submissionsData = await getSubmissionsSpreadsheet();

  console.log(submissionsData);
  const parseRowAsUser = (row) => {
    const userId = `${row[1]} - ${row[2]}`;
    let answers = {};
    let correctNotFinalizedCount = 0;
    let correctFinalizedCount = 0;
    for (const [index, answer] of row.entries()) {
      if (index < 3) {
        continue;
      }

      const rightAnswer = answerKey[index];

      let answerStatus;

      if (rightAnswer.answer === '') {
        answerStatus = 'unknown';
      } else if (answer === rightAnswer.answer) {
        if (rightAnswer.isFinalized) {
          answerStatus = 'correctFinalized';
          correctFinalizedCount += 1;
        } else {
          answerStatus = 'correctNotFinalized';
          correctNotFinalizedCount += 1;
        }
      } else {
        answerStatus = 'incorrect';
      }

      answers[index] = {
        answer: answer,
        answerStatus,
      }
    }
    return [ userId, { answers, correctFinalizedCount, correctNotFinalizedCount }];
  }



  let summary = {};
  for (const [index, row] of submissionsData.values.entries()) {
    if (index < 1) {
      continue;
    }
    const [ userId, data ] = parseRowAsUser(row);

    summary[userId] = data;
  }
  return summary;
}

