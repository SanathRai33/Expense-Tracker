const User = require("../models/userModel");
const logger = require("../utils/logger");

const getLeaderboard = async (req, res) => {
  try {
    const isPremium =
      req?.user?.isPremium;

    if (!isPremium) {
      logger.warn(
        `Unauthorized leaderboard access attempt by user ${req?.user?.id}`
      );

      return res.status(403).json({
        message:
          "This feature is for subscribers only.",
      });
    }

    const result = await User.find({})
      .select("name totalExpense")
      .sort({
        totalExpense: -1,
      });

    logger.info(
      `Leaderboard accessed by premium user ${req?.user?.id}`
    );

    res.status(200).json({
      leaderboard: result,
      message:
        "Leaderboard fetched successfully",
    });
  } catch (error) {
    logger.error(
      `Leaderboard Error for user ${req?.user?.id}:`,
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getLeaderboard,
};