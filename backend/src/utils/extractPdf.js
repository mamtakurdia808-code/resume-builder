const pdf = require("pdf-parse");

const extractPdfText = async (buffer) => {
  try {
    const data = await pdf(buffer);

    return data.text
      .replace(/\r/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();

  } catch (error) {
    console.error("PDF Parse Error:", error);
    throw error;
  }
};

module.exports = extractPdfText;