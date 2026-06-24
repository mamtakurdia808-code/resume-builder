const client = require("../config/groq");
const buildRewritePrompt = require("./rewritePrompt");
const parseGroqaiJSON = require("./jsonParser");

const rewriteResume = async ({ section, content }) => {
  try {
    const prompt = buildRewritePrompt({
      section,
      content,
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

const parsed = parseGroqaiJSON(text);

return parsed.rewritten;

  } catch (error) {
    console.error("Rewrite Service Error:", error);
    throw error;
  }
};

module.exports = rewriteResume;