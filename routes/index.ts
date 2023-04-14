import express, { Router } from "express";
import userController from "../controllers/user";
import shareController from "../controllers/share";
import portfolioController from "../controllers/portfolio";
import salesController from "../controllers/sale";
import {
  checkAmount,
  checkEmail,
  checkId,
  checkPrice,
  checkShareId,
  validateNumberWithTwoDecimals,
} from "../utils/validator";

const router: Router = express.Router();

// user routes
router.post("/createUser", [checkEmail], userController.createUser);
router.get("/getUser/:id", [checkId()], userController.getUser);
router.put("/updateUser/:id", [checkId()], userController.updateUser);
router.delete("/deleteUser/:id", [checkId()], userController.deleteUser);
router.get("/getAllUsers", userController.getAllUsers);
// portfolio routes
router.post(
  "/createPortfolio",
  [checkId("userId")],
  portfolioController.createPortfolio
);
router.delete(
  "/deletePortfolio/:id",
  [checkId()],
  portfolioController.deletePortfolio
);

//share routes
router.post(
  "/createShare",
  [checkPrice, checkShareId],
  shareController.createShare
);
router.put(
  "/updateSharePrice/:id",
  [checkId()],
  shareController.updateSharePrice
);
router.delete(
  "/deleteShare/:shareId",
  [checkShareId],
  shareController.deleteShare
);

// trade routes
router.post(
  "/sell",
  [
    checkAmount,
    checkShareId,
    checkId("portfolioId"),
    validateNumberWithTwoDecimals("amount"),
  ],
  salesController.sell
);
router.post(
  "/buy",
  [
    checkAmount,
    checkId("portfolioId"),
    checkShareId,
    validateNumberWithTwoDecimals("amount"),
  ],
  salesController.buy
);
export default router;
