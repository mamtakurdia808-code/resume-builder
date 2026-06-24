const client = require("../config/groq");
const buildATSPrompt = require("./atsPrompt");
const parseGroqJSON = require("./jsonParser");

const analyzeResumeWithGroqai = async ({
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

    const result = parseGroqJSON(text);

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
        throw new Error(`Groq response missing field: ${field}`);
      }
    }

    return result;
  } catch (error) {
    console.error("ATS Service Error:", error);

    throw new Error("Failed to analyze resume using Groq.");
  }
};

module.exports = analyzeResumeWithGroqai;