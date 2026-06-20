const ai = require("../config/gemini");
const buildJobAnalysisPrompt = require("./jobAnalysisPrompt");
const parseGeminiJSON = require("../services/jsonParser");

const analyzeJobDescription = async ({
  jobTitle,
  companyName,
  jobDescription,
}) => {
  try {
    const prompt = buildJobAnalysisPrompt({
      jobTitle,
      companyName,
      jobDescription,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("Empty response received from Gemini.");
    }

    const analysis = parseGeminiJSON(response.text);

    return analysis;
  } catch (error) {
    console.error("Job Analysis Service Error:", error);
    throw new Error("Failed to analyze job description.");
  }
};

module.exports = {
  analyzeJobDescription,
};