const express = require("express");

const router = express.Router();

const { suggestCategory } = require("../controllers/aiController");

const auth = require("../middleware/auth");

router.post("/categorize", auth, suggestCategory);

module.exports = router;
