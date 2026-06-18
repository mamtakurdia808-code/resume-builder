const pool = require("../config/db");

/**
 * Dashboard Controller
 * GET /api/dashboard
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      userResult,
      resumeCount,
      atsCount,
      avgATS,
      highestATS,
      aiReviewCount,
      jobAnalysisCount,
      templateCount,
      premiumTemplateCount,
      recentResumes,
      recentATS,
      recentReviews,
      recentJobs,
    ] = await Promise.all([

      // User Details
      pool.query(
        `SELECT
            id,
            full_name,
            email,
            profile_picture,
            currentrole,
            experience_years,
            location,
            created_at
         FROM users
         WHERE id = $1`,
        [userId]
      ),

      // Resume Count
      pool.query(
        `SELECT COUNT(*)::int AS total
         FROM resumes
         WHERE user_id=$1`,
        [userId]
      ),

      // ATS Reports Count
      pool.query(
        `SELECT COUNT(*)::int AS total
         FROM ats_reports
         WHERE user_id=$1`,
        [userId]
      ),

      // Average ATS Score
      pool.query(
        `SELECT
            COALESCE(ROUND(AVG(ats_score)),0)::int AS average
         FROM ats_reports
         WHERE user_id=$1`,
        [userId]
      ),

      // Highest ATS Score
      pool.query(
        `SELECT
            COALESCE(MAX(ats_score),0)::int AS highest
         FROM ats_reports
         WHERE user_id=$1`,
        [userId]
      ),

      // AI Review Count
      pool.query(
        `SELECT COUNT(*)::int AS total
         FROM ai_reviews
         WHERE user_id=$1`,
        [userId]
      ),

      // Job Analysis Count
      pool.query(
        `SELECT COUNT(*)::int AS total
         FROM job_analysis
         WHERE user_id=$1`,
        [userId]
      ),

      // Templates Count
      pool.query(
        `SELECT COUNT(*)::int AS total
         FROM templates`
      ),

      // Premium Templates
      pool.query(
        `SELECT COUNT(*)::int AS total
         FROM templates
         WHERE is_premium=true`
      ),

      // Recent Resumes
      pool.query(
        `
        SELECT
            r.id,
            r.title,
            t.template_name,
            r.updated_at
        FROM resumes r
        LEFT JOIN templates t
        ON r.template_id=t.id
        WHERE r.user_id=$1
        ORDER BY r.updated_at DESC
        LIMIT 5
        `,
        [userId]
      ),

      // Recent ATS Reports
      pool.query(
        `
        SELECT
            id,
            job_title,
            company_name,
            ats_score,
            created_at
        FROM ats_reports
        WHERE user_id=$1
        ORDER BY created_at DESC
        LIMIT 5
        `,
        [userId]
      ),

      // Recent AI Reviews
      pool.query(
        `
        SELECT
            id,
            review_type,
            resume_id,
            created_at
        FROM ai_reviews
        WHERE user_id=$1
        ORDER BY created_at DESC
        LIMIT 5
        `,
        [userId]
      ),

      // Recent Job Analysis
      pool.query(
        `
        SELECT
            id,
            job_title,
            company_name,
            created_at
        FROM job_analysis
        WHERE user_id=$1
        ORDER BY created_at DESC
        LIMIT 5
        `,
        [userId]
      )

    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",

      data: {

        user: userResult.rows[0],

        stats: {
          totalResumes: resumeCount.rows[0].total,
          totalATSReports: atsCount.rows[0].total,
          averageATSScore: avgATS.rows[0].average,
          highestATSScore: highestATS.rows[0].highest,
          totalAIReviews: aiReviewCount.rows[0].total,
          totalJobAnalysis: jobAnalysisCount.rows[0].total,
          totalTemplates: templateCount.rows[0].total,
          premiumTemplates: premiumTemplateCount.rows[0].total,
        },

        recentResumes: recentResumes.rows,

        recentATSReports: recentATS.rows,

        recentAIReviews: recentReviews.rows,

        recentJobAnalysis: recentJobs.rows,
      },
    });

  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  getDashboardStats,
};