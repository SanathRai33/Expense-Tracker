const mongoose = require("mongoose");

const forgotPasswordRequestSchema =
  new mongoose.Schema(
    {
      requestId: {
        type: String,
        required: true,
        unique: true,
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

const ForgotPasswordRequest = mongoose.model(
  "ForgotPasswordRequest",
  forgotPasswordRequestSchema
);

module.exports = ForgotPasswordRequest;