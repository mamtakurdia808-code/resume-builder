const buildJobAnalysisPrompt = ({
  jobTitle,
  companyName,
  jobDescription,
}) => `
You are an expert Technical Recruiter, ATS Specialist, Career Coach, and Hiring Manager.

Analyze the following job description carefully.

Job Title:
${jobTitle || "Extract from description if available"}

Company:
${companyName || "Extract from description if available"}

Job Description:
${jobDescription}

Instructions:

- Return ONLY valid JSON.
- Do NOT include markdown.
- Do NOT explain anything.
- If a field cannot be determined, return an empty string or empty array.
- Extract all important information from the job description.

Return EXACTLY this JSON:

{
  "jobTitle": "",
  "company": "",
  "summary": "",

  "experienceRequired": "",
  "educationRequired": "",

  "requiredSkills": [],
  "preferredSkills": [],

  "technicalSkills": [],
  "softSkills": [],
  "toolsAndTechnologies": [],

  "responsibilities": [],

  "importantKeywords": [],

  "aiSuggestions": {
    "recommendedResumeSkills": [],
    "recommendedProjects": [],
    "recommendedCertifications": [],
    "recommendedSummary": ""
  }
}

Rules for extraction:

- jobTitle = exact role.
- company = company name.
- experienceRequired = e.g. "2-4 years".
- educationRequired = degree requirement.
- requiredSkills = mandatory skills.
- preferredSkills = nice-to-have skills.
- technicalSkills = programming languages, frameworks, databases, cloud, APIs.
- softSkills = communication, teamwork, leadership, adaptability, etc.
- toolsAndTechnologies = software, IDEs, cloud platforms, CI/CD, Git, Jira, Docker, Kubernetes, etc.
- responsibilities = major responsibilities.
- importantKeywords = ATS keywords recruiters would search.
- recommendedResumeSkills = skills candidate should emphasize.
- recommendedProjects = project ideas matching this role.
- recommendedCertifications = relevant certifications.
- recommendedSummary = write a 3-4 sentence ATS-friendly professional summary tailored to this job.
`;

module.exports = buildJobAnalysisPrompt;