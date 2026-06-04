const ai = require("../utils/gemini");

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

    res.status(200).json({
      category: response.text.trim(),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  suggestCategory,
};
