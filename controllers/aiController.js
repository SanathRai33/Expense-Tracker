const ai = require("../utils/gemini");
const logger = require("../utils/logger");

const suggestCategory = async (req, res) => {
  try {
    const { description } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
                Categorize this expense into exactly one category:
                Food Transport Entertainment Utilities Other
                Expense: ${description}
                Return only the category name.
        `,
    });

    logger.info(`Category suggested for expense: ${description.substring(0, 50)}`);
    res.status(200).json({
      category: response.text.trim(),
    });
  } catch (error) {
    logger.error(`Error in suggestCategory for user ${req?.user?.id}`, error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  suggestCategory,
};
