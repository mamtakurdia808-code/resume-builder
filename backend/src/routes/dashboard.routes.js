const express = require("express");
const router = express.Router();

const {
  getDashboardStats
} = require("../controllers/dashboard.controller");

const authenticationToken = require("../middleware/auth.middleware");

router.get("/",authenticationToken, getDashboardStats);

module.exports = router;
