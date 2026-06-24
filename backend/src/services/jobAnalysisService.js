const client = require("../config/groq");
const buildJobAnalysisPrompt = require("./jobAnalysisPrompt");
const parseGroqaiJSON = require("../services/jsonParser");

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

    const text = response?.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Empty response received from Groq.");
    }

    const analysis = parseGroqaiJSON(text);

    return analysis;
  } catch (error) {
    console.error("Job Analysis Service Error:", error);
    throw new Error("Failed to analyze job description.");
  }
};

module.exports = {
  analyzeJobDescription,
};