const path = require("path");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const brevo = require("@getbrevo/brevo");
const User = require("../models/userModel");
const ForgotPasswordRequest = require("../models/forgotPasswordRequestModel");
const logger = require("../utils/logger");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const requestId = uuidv4();

    await ForgotPasswordRequest.create({
      requestId,
      userId: user._id,
      isActive: true,
    });

    const apiInstance = new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );

    const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:5000";

    const resetUrl = `${appBaseUrl}/password/resetpassword/${requestId}`;

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,

        name: "Expense Tracker",
      },

      to: [
        {
          email,
        },
      ],

      subject: "Reset Password",

      htmlContent: `
        <h2>Reset Password</h2>

        <a href="${resetUrl}">
          Reset Password
        </a>
      `,
    });

    logger.info(`Password reset email sent to ${email}`);

    res.status(200).json({
      message: "Reset email sent",
    });
  } catch (error) {
    logger.error(`Error in forgotPassword for email: ${req.body.email}`, error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { requestId, password } = req.body;

    if (!requestId || !password) {
      return res.status(400).json({
        message: "Request ID and password are required",
      });
    }

    const request = await ForgotPasswordRequest.findOne({
      requestId,
    });

    if (!request || !request.isActive) {
      logger.warn(`Invalid reset link attempted: ${requestId}`);

      return res.status(400).json({
        message: "Invalid reset link",
      });
    }

    const user = await User.findById(request.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    request.isActive = false;

    await request.save();

    logger.info(`Password updated successfully for user: ${user.email}`);
    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    logger.error(`Error in updatePassword for requestId: ${req.body.requestId}`, error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ForgotPasswordRequest.findOne({
      requestId: id,
    });

    if (!request || !request.isActive) {
      logger.warn(`Expired or invalid reset link accessed: ${id}`);
      return res.send("Reset Link Expired");
    }

    res.sendFile(path.join(__dirname, "../views/resetPassword.html"));
  } catch (error) {
    logger.error(`Error in resetPassword for id: ${req.params.id}`, error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  forgotPassword,
  updatePassword,
  resetPassword,
};
