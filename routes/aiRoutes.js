const express = require("express");

const router = express.Router();

const { suggestCategory } = require("../controllers/aiController");

router.post("/categorize", suggestCategory);

module.exports = router;