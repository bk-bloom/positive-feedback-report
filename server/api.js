require("dotenv").config();
const axios = require("axios");

const { generateStrength, generateValue } = require("./utils");

const SURVEYID = "400221858";

const getSurveysResponseInBulk = async (name) => {
  let strength = {};
  let values = {};
  const allData = [];
  try {
    const response = await axios.get(
      `https://api.surveymonkey.com/v3/surveys/${SURVEYID}/responses/bulk?page=1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SURVEY_MONKEY_ACCESS_TOKEN}`,
        },
      }
    );
    // response.data.per_page: 50,
    // response.data.page: 1,
    // response.data.total: 71,
    //   response.data.links: {
    //     self: 'https://api.surveymonkey.com/v3/surveys/400221858/responses/bulk?page=1&per_page=50',
    //     next: 'https://api.surveymonkey.com/v3/surveys/400221858/responses/bulk?page=2&per_page=50',
    //     last: 'https://api.surveymonkey.com/v3/surveys/400221858/responses/bulk?page=2&per_page=50'
    //   }
    allData.push(...response.data.data);
    const totalPage = Math.ceil(response.data.total / response.data.per_page);

    for (let i = 2; i <= totalPage; i++) {
      const response = await axios.get(
        `https://api.surveymonkey.com/v3/surveys/${SURVEYID}/responses/bulk?page=${i}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.SURVEY_MONKEY_ACCESS_TOKEN}`,
          },
        }
      );
      allData.push(...response.data.data);
    }
    // console.log(response.data);

    // response.data.data[i]: 응답자 정보
    // response.data.data[i].pages: 응답자 답변 정보
    const users = allData.filter(
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

module.exports = { getSurveysResponseInBulk };
