const mammoth = require("mammoth");

const extractDocxText = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({
      buffer,
    });

    return result.value
      .replace(/\r/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();
  } catch (error) {
    throw new Error("Unable to extract text from DOC/DOCX.");
  }
};

module.exports = extractDocxText;