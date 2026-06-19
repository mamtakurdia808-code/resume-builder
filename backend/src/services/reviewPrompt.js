const buildReviewPrompt = ({ resume, reviewType, inputText }) => {
  return `
You are an expert Resume Reviewer and Career Coach.

Review the following resume.

Review Type:
${reviewType}

Additional User Instructions:
${inputText || "None"}

Resume:
${JSON.stringify(resume, null, 2)}

Analyze the resume and provide constructive feedback.

Evaluate:

1. Overall Quality (0-100)
2. Resume Summary
3. Skills
4. Work Experience
5. Projects
6. Education
7. Grammar
8. Formatting
9. ATS Compatibility

Return ONLY valid JSON.

Do NOT include markdown.

Response format:

{
  "overall_score": 0,
  "summary_feedback": "",
  "skills_feedback": "",
  "experience_feedback": "",
  "projects_feedback": "",
  "education_feedback": "",
  "grammar_feedback": "",
  "formatting_feedback": "",
  "ats_feedback": "",
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}
`;
};

module.exports = buildReviewPrompt;