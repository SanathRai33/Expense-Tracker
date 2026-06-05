const brevo = require("@getbrevo/brevo");
const User = require("../models/userModel");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const apiInstance =
      new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

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
      subject: "Forgot Password",
      htmlContent: `
        <h2>Password Reset Request</h2>
        <p>This is a test email.</p>
      `,
    });

    res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  forgotPassword,
};