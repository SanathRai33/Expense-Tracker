const Expense = require("./expenseModel");
const User = require("./userModel");
const ForgotPasswordRequest = require('./forgotPasswordRequestModel')

//Expenses
User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User, { foreignKey: "userId" });

//Forget Password
User.hasMany(ForgotPasswordRequest, { foreignKey: "userId"});
ForgotPasswordRequest.belongsTo(User, { foreignKey: "userId"});

module.exports = {
  Expense,
  User,
};
