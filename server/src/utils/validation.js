const VALID_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];

/**
 * Validates incoming expense data.
 * Returns an array of error messages (empty = valid).
 */
function validateExpense(data) {
  const errors = [];

  if (!data.title || String(data.title).trim() === "") {
    errors.push("Title is required.");
  }

  if (data.amount === undefined || data.amount === null || data.amount === "") {
    errors.push("Amount is required.");
  } else {
    const amount = parseFloat(data.amount);
    if (isNaN(amount)) {
      errors.push("Amount must be a number.");
    } else if (amount <= 0) {
      errors.push("Amount must be greater than 0.");
    }
  }

  if (!data.category || !VALID_CATEGORIES.includes(data.category)) {
    errors.push(
      `Category is required and must be one of: ${VALID_CATEGORIES.join(", ")}.`
    );
  }

  if (!data.date || String(data.date).trim() === "") {
    errors.push("Date is required.");
  } else {
    const d = new Date(data.date);
    if (isNaN(d.getTime())) {
      errors.push("Date must be a valid date.");
    }
  }

  return errors;
}

/**
 * Validates the budget limit value.
 */
function validateBudget(data) {
  const errors = [];
  if (data.monthlyLimit === undefined || data.monthlyLimit === null) {
    errors.push("monthlyLimit is required.");
  } else {
    const val = parseFloat(data.monthlyLimit);
    if (isNaN(val) || val < 0) {
      errors.push("monthlyLimit must be a non-negative number.");
    }
  }
  return errors;
}

module.exports = { validateExpense, validateBudget, VALID_CATEGORIES };
