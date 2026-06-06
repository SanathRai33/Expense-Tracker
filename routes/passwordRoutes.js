const express = require("express");

const router = express.Router();

const { forgotPassword, updatePassword, resetPassword } = require("../controllers/passwordController");

router.post("/forgotpassword", forgotPassword);
router.get("/resetpassword/:id", resetPassword);
router.post("/updatepassword", updatePassword);

module.exports = router;
