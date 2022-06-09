require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { generateStrength, generateValue } = require("./utils");

const app = express();
const PORT = process.env.PORT || 8080;

const SURVEYID = "400221858";

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/report", async (req, res) => {
  const { name } = req.query;

  const { strengthWords, valueWords, appreciateComments, expectComments } =
    await getSurveysResponseInBulk(name);

  res.json({
    strengthWords,
    valueWords,
    appreciateComments,
    expectComments,
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const getSurveysResponseInBulk = async (name) => {
  let strength = {};
  let values = {};

  try {
    const response = await axios.get(
      `https://api.surveymonkey.com/v3/surveys/${SURVEYID}/responses/bulk`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SURVEY_MONKEY_ACCESS_TOKEN}`,
        },
      }
    );
    // console.log(response.data);

    // response.data.data[i]: 응답자 정보
    // response.data.data[i].pages: 응답자 답변 정보
    const users = response.data.data.filter(
      (user) => user.pages[0].questions[0].answers[0].text === name
    );
    // console.log(`응답한 사람 수: ${users.length}`);

    const userAnswers = users.map((user) => user.pages[0].questions);

    const appreciateComments = [];
    const expectComments = [];

    for (let i = 0; i < userAnswers.length; i++) {
      for (let j = 0; j < userAnswers[i].length; j++) {
        const question = userAnswers[i][j];
        // console.log(question);
        switch (question.id) {
          case "61895716":
          case "61895718":
            // console.log(question.answers[0].text);
            break;
          case "61895719":
          case "61897203":
          case "61897366":
            generateStrength(question, strength);
            break;
          case "61897541":
          case "61897601":
            generateValue(question, values);
            break;
          case "61895726":
            appreciateComments.push(question.answers[0].text);
            break;
          case "61895725":
            expectComments.push(question.answers[0].text);
            break;
          default:
            break;
        }
      }
    }

    let strengthWords = [];
    for (const key in strength) {
      strengthWords.push([key, strength[key]]);
    }

    strengthWords.sort((a, b) => b[1] - a[1]);

    let valueWords = [];
    for (const key in values) {
      valueWords.push([key, values[key]]);
    }
    valueWords.sort((a, b) => b[1] - a[1]);
    return {
      strengthWords,
      valueWords,
      appreciateComments,
      expectComments,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

// getSurveyResponse();
// getSurveysById(surveyId);
// getSurveyPages();
// getSurveyQuestions();
// getSurveyQuestionById();
// getSurveyResponseDetail();
// getSurveysResponseInBulk();

// const pageId = "25450969";
// const responseId = [114002898019, 114002903221, 114002904957];
// const questionId = [
//   "61895717",
//   "61895716",
//   "61895718",
//   "61895719",
//   "61897203",
//   "61897366",
//   "61897541",
//   "61897601",
//   "61895726",
//   "61895725",
//   "61895724",
// ];

// const getSurveysById = async (id) => {
//   try {
//     const response = await axios.get(
//       `https://api.surveymonkey.com/v3/surveys/${id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.SURVEY_MONKEY_ACCESS_TOKEN}`,
//         },
//       }
//     );

//     console.log(response.data);
//   } catch (err) {
//     console.error(err);
//   }
// };

// const getSurveyPages = async () => {
//   const response = await axios.get(
//     `https://api.surveymonkey.com/v3/surveys/${surveyId}/pages`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.SURVEY_MONKEY_ACCESS_TOKEN}`,
//       },
//     }
//   );

//   console.log(response.data);
// };

// const getSurveyQuestions = async () => {
//   const response = await axios.get(
//     `https://api.surveymonkey.com/v3/surveys/${surveyId}/pages/${pageId}/questions`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.SURVEY_MONKEY_ACCESS_TOKEN}`,
//       },
//     }
//   );
//   console.log(response.data.data);
//   const questionsId = response.data.data.map((q) => q.id);
//   console.log(questionsId);
// };

// const getSurveyQuestionById = async () => {
//   for (let i = 0; i < questionId.length; i++) {
//     const response = await axios.get(
//       `https://api.surveymonkey.com/v3/surveys/${surveyId}/pages/${pageId}/questions/${questionId[i]}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.SURVEY_MONKEY_ACCESS_TOKEN}`,
//         },
//       }
//     );
//     if (response.data.answers) {
//       const data = response.data.answers.choices;
//       const choices = {};
//       for (let i = 0; i < data.length; i++) {
//         choices[data[i].id] = {
//           text: data[i].text,
//         };
//       }

//       console.log(choices);
//     }
//   }

//   //   console.log(response.data);
//   //   console.log(response.data.answers.choices);
// };

// const getSurveyResponse = async () => {
//   try {
//     const response = await axios.get(
//       `https://api.surveymonkey.com/v3/surveys/${surveyId}/responses`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.SURVEY_MONKEY_ACCESS_TOKEN}`,
//         },
//       }
//     );
//     console.log(response.data);
//     console.log(response.data.data[0].href);

//     // const surveyResponse = await axios.get(`${response.data.data[0].href}`, {
//     //   headers: {
//     //     Authorization: `Bearer ${process.env.SURVEY_MONKEY_ACCESS_TOKEN}`,
//     //   },
//     // });
//     // console.log(surveyResponse);
//   } catch (err) {
//     console.error(err);
//   }
// };

// const getSurveyResponseDetail = async () => {
//   const response = await axios.get(
//     `https://api.surveymonkey.com/v3/surveys/${surveyId}/responses/${responseId[2]}/details`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.SURVEY_MONKEY_ACCESS_TOKEN}`,
//       },
//     }
//   );

//   console.log(response.data);
//   const numQuestions = response.data.pages[0].questions.length;

//   for (let i = 0; i < numQuestions; i++) {
//     console.log(response.data.pages[0].questions[i].answers);
//   }
// };
