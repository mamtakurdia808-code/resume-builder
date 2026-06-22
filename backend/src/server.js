require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const profileRoutes = require("./routes/profile.routes");
const atsRoutes = require("./routes/ats.routes");
const aiReviewRoutes = require("./routes/ai.routes");
const jobAnalysisRoutes = require("./routes/jobAnalysis.routes");
const settingsRoutes = require("./routes/settings.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/ai", aiReviewRoutes);
app.use("/api/job-analysis", jobAnalysisRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/", (req, res) => {
  res.send("ResumeAI API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});