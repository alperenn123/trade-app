import { check, body } from "express-validator";

export const checkEmail = check("email")
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Email is not valid");

export const checkId = (field: string = "id") => {
  return check(field).notEmpty().withMessage(`${field} is required`);
};

export const checkShareId = check("shareId")
  .notEmpty()
  .withMessage("ShareId is required")
  .isLength({ min: 3, max: 3 })
  .withMessage("Share id must be exactly length of 3");

export const checkAmount = check("amount")
  .notEmpty()
  .withMessage("Amount cannot be empty")
  .isNumeric()
  .withMessage("Amount must be numeric");

export const checkPrice = check("price")
  .notEmpty()
  .withMessage("Price is required");

const TWO_DECIMALS_REGEX = /^\d+(\.\d{1,2})?$/;

export const validateNumberWithTwoDecimals = (field: string) => {
  return body(field)
    .trim()
    .custom((value: string) => {
      if (!TWO_DECIMALS_REGEX.test(value)) {
        throw new Error(
          `'${field}' must be a number with exactly two decimal places`
        );
      }
      return true;
    });
};
