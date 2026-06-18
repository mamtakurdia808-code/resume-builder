const ai = require("../config/gemini");
const buildATSPrompt = require("./atsPrompt");
const parseGeminiJSON = require("./jsonParser");

const analyzeResumeWithGemini = async ({
  resume,
  jobTitle,
  companyName,
  jobDescription,
}) => {
  try {
    const prompt = buildATSPrompt({
      resume,
      jobTitle,
      companyName,
      jobDescription,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    const result = parseGeminiJSON(text);

    // Validation
    const requiredFields = [
      "ats_score",
      "keyword_match",
      "formatting_score",
      "skills_score",
      "experience_score",
      "education_score",
      "matched_keywords",
      "missing_keywords",
      "strengths",
      "weaknesses",
      "suggestions",
    ];

    for (const field of requiredFields) {
      if (!(field in result)) {
        throw new Error(`Gemini response missing field: ${field}`);
      }
    }

    return result;
  } catch (error) {
    console.error("ATS Service Error:", error);

    throw new Error("Failed to analyze resume using Gemini.");
  }
};

module.exports = analyzeResumeWithGemini;