const parseGeminiJSON = (text) => {
  try {
    if (!text) {
      throw new Error("Empty Gemini response.");
    }

    let cleaned = text.trim();

    cleaned = cleaned.replace(/```json/g, "");
    cleaned = cleaned.replace(/```/g, "");
    cleaned = cleaned.trim();

    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error("Failed to parse Gemini JSON response.");
  }
};

module.exports = parseGeminiJSON;