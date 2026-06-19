const ai = require("../config/gemini");
const buildReviewPrompt = require("./reviewPrompt");
const parseGeminiJSON = require("./jsonParser");

const reviewResumeWithGemini = async ({
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    const result = parseGeminiJSON(text);

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

module.exports = reviewResumeWithGemini;