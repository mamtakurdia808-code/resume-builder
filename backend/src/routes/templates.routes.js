const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const {
  getTemplates,
  getTemplateById,
  applyTemplate,
} = require("../controllers/templates.controller");

router.get("/", authenticate, getTemplates);

router.get("/:id", authenticate, getTemplateById);

router.put("/apply", authenticate, applyTemplate);

module.exports = router;