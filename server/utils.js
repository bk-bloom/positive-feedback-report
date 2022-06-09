const { QUESTIONS, questionChoices } = require("./db");

const generateStrength = (question, STRENGTH) => {
  for (let i = 0; i < question.answers.length; i++) {
    //   console.log(i);
    const text = questionChoices[question.answers[i].choice_id].text;

    //   STRENGTH[questionChoices[userAnswers[i][j].answers[k].choice_id]];
    if (STRENGTH[text] === undefined) {
      STRENGTH[text] = 1;
    } else {
      STRENGTH[text] += 1;
    }
  }
};

const generateValue = (question, VALUES) => {
  for (let i = 0; i < question.answers.length; i++) {
    const text = questionChoices[question.answers[i].choice_id].text;

    //   STRENGTH[questionChoices[userAnswers[i][j].answers[k].choice_id]];
    if (VALUES[text] === undefined) {
      VALUES[text] = 1;
    } else {
      VALUES[text] += 1;
    }
  }
};

module.exports = { generateStrength, generateValue };
