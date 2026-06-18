const buildATSPrompt = ({ resume, jobTitle, companyName, jobDescription }) => {
  return `
You are an expert ATS (Applicant Tracking System) and senior technical recruiter.

Analyze the candidate's resume against the job description.

Job Title:
${jobTitle}

Company:
${companyName || "Not Provided"}

Job Description:
${jobDescription}

Resume:
${JSON.stringify(resume, null, 2)}

Instructions:

Evaluate the resume on:

1. ATS Score (0-100)
2. Keyword Match (0-100)
3. Formatting Score (0-100)
4. Skills Score (0-100)
5. Experience Score (0-100)
6. Education Score (0-100)

Find:

- matched_keywords
- missing_keywords
- strengths
- weaknesses
- suggestions

IMPORTANT:

Return ONLY valid JSON.

Do NOT include markdown.

Do NOT include explanation.

Response format:

{
  "ats_score": 0,
  "keyword_match": 0,
  "formatting_score": 0,
  "skills_score": 0,
  "experience_score": 0,
  "education_score": 0,
  "matched_keywords": [],
  "missing_keywords": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}
`;
};

module.exports = buildATSPrompt;