const buildRewritePrompt = ({ section, content }) => `
You are an expert resume writer and ATS optimization specialist.

Your task is to rewrite the following resume section.

Rules:
- Keep the meaning the same.
- Make it ATS friendly.
- Use powerful action verbs.
- Use professional language.
- Make it concise.
- Do not invent fake achievements.
- Return ONLY valid JSON.
- No markdown.

Resume Section:
${section}

Original Content:
${content}

Return:

{
  "rewritten":"..."
}
`;

module.exports = buildRewritePrompt;