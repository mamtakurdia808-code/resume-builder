const ai = require("../config/gemini");
const buildRewritePrompt = require("./rewritePrompt");
const parseGeminiJSON = require("./jsonParser");

const rewriteResume = async ({ section, content }) => {
  try {
    const prompt = buildRewritePrompt({
      section,
      content,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const parsed = parseGeminiJSON(response.text);
return parsed.rewritten;

  } catch (error) {
    console.error("Rewrite Service Error:", error);
    throw error;
  }
};

module.exports = rewriteResume;