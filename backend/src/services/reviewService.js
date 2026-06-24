const client = require("../config/groq");
const buildReviewPrompt = require("./reviewPrompt");
const parseGroqaiJSON = require("./jsonParser");

const reviewResumeWithGroqai = async ({
  resume,
  reviewType,
  inputText,
}) => {
  try {
    const prompt = buildReviewPrompt({
      resume,
      reviewType,
      inputText,
    });

    const response = await client.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  response_format: {
    type: "json_object",
  },
});

    const text = response.choices[0].message.content;

    const result = parseGroqaiJSON(text);

    const requiredFields = [
      "overall_score",
      "summary_feedback",
      "skills_feedback",
      "experience_feedback",
      "projects_feedback",
      "education_feedback",
      "grammar_feedback",
      "formatting_feedback",
      "ats_feedback",
      "strengths",
      "weaknesses",
      "suggestions",
    ];

    for (const field of requiredFields) {
      if (!(field in result)) {
        throw new Error(`Missing field: ${field}`);
      }
    }

    return result;

  } catch (error) {

    console.error("AI Review Error:", error);

    throw new Error("Failed to review resume using Gemini.");
  }
};

module.exports = reviewResumeWithGroqai;