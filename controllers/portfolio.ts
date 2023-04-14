import { Request, Response, NextFunction } from "express";
import { Portfolio } from "../models/portfolio-model";
import { User } from "../models/user-model";
import { validationResult } from "express-validator";

const createPortfolio = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const user = await User.findOne({ where: { id: req.body.userId } });
    if (!user) {
      return res.status(400).json({
        errorMessage: "There is no user with this id registered",
      });
    }
    await Portfolio.create({ userId: req.body.userId });
    return res.status(201).json({
      message: "Portfolio created",
    });
  } catch (ex) {
    if (ex instanceof Error) {
      return res.status(500).json({
        errorMessage: ex.message,
      });
    }
    return res.status(500).json({
      errorMessage: "Server error",
    });
  }
};

const deletePortfolio = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    await Portfolio.destroy({ where: { id: req.params.id } });
    return res.status(200).json({
      message: "Portfolio deleted",
    });
  } catch (ex) {
    if (ex instanceof Error) {
      return res.status(500).json({
        errorMessage: ex.message,
      });
    }
    return res.status(500).json({
      errorMessage: "Server error",
    });
  }
};

export default { createPortfolio, deletePortfolio };
