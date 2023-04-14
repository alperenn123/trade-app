import { Request, Response, NextFunction } from "express";
import { Share } from "../models/share-model";
import { validationResult } from "express-validator";

const createShare = async (req: Request, res: Response, _: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    await Share.create({ price: req.body.price, id: req.body.shareId });
    return res.status(201).json({
      message: "Share created",
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

const deleteShare = async (req: Request, res: Response, _: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    await Share.destroy({ where: { id: req.params.shareId } });
    return res.status(200).json({
      message: "Share deleted",
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

const updateSharePrice = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const updateQuery = {
      price: req.body.price,
    };
    const [affectedCount] = await Share.update(updateQuery, {
      where: { id: req.params.id.toUpperCase() },
    });

    if (affectedCount === 0) {
      return res.status(400).json({
        error: "Could not update the price, probably share is not registered",
      });
    }

    return res.status(200).json({
      message: "Share updated",
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

export default { createShare, deleteShare, updateSharePrice };
