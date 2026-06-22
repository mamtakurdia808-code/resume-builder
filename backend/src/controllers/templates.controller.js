const pool = require("../config/db");

const getTemplates = async (req, res) => {
  try {
    const templates = await pool.query(
      `SELECT
          id,
          template_name,
          description,
          thumbnail,
          category,
          is_premium
       FROM templates
       ORDER BY id ASC`
    );

    return res.status(200).json({
      success: true,
      count: templates.rows.length,
      templates: templates.rows,
    });
  } catch (error) {
    console.error("Get Templates Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch templates.",
    });
  }
};

const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await pool.query(
      `SELECT
          id,
          template_name,
          description,
          thumbnail,
          category,
          is_premium
       FROM templates
       WHERE id=$1`,
      [id]
    );

    if (template.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Template not found.",
      });
    }

    return res.status(200).json({
      success: true,
      template: template.rows[0],
    });
  } catch (error) {
    console.error("Get Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch template.",
    });
  }
};

/**
 * Get resume with selected template
 */
const getResumeWithTemplate = async (resumeId, userId) => {
  const result = await pool.query(
    `SELECT
        r.id,
        r.title,
        r.resume_data,
        r.template_id,

        t.template_name,
        t.thumbnail,
        t.category,
        t.is_premium

     FROM resumes r

     LEFT JOIN templates t
        ON r.template_id = t.id

     WHERE r.id = $1
     AND r.user_id = $2`,
    [resumeId, userId]
  );

  return result.rows[0];
};

const applyTemplate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resume_id, template_id } = req.body;

    // Validation
    if (!resume_id || !template_id) {
      return res.status(400).json({
        success: false,
        message: "Resume ID and Template ID are required",
      });
    }

    // Check if resume exists and belongs to user
    const resumeResult = await pool.query(
      `SELECT id, title
       FROM resumes
       WHERE id = $1
       AND user_id = $2`,
      [resume_id, userId]
    );

    if (resumeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Check if template exists
    const templateResult = await pool.query(
      `SELECT id, template_name
       FROM templates
       WHERE id = $1`,
      [template_id]
    );

    if (templateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    // Apply template to resume
    const updatedResume = await pool.query(
      `UPDATE resumes
       SET template_id = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING
         id,
         title,
         template_id,
         updated_at`,
      [template_id, resume_id]
    );

    return res.status(200).json({
      success: true,
      message: "Template applied successfully",
      data: {
        resume: updatedResume.rows[0],
        template: {
          id: templateResult.rows[0].id,
          template_name: templateResult.rows[0].template_name,
        },
      },
    });
  } catch (error) {
    console.error("Apply Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to apply template",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
    getTemplates,
    getTemplateById,
    applyTemplate,
    getResumeWithTemplate,
}