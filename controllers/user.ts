import { Request, Response, NextFunction } from "express";
import { User } from "../models/user-model";
import { validationResult } from "express-validator";

const createUser = async (req: Request, res: Response, _: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const userModel = {
      firstName: req.body.firstName ?? null,
      lastName: req.body.lastName ?? null,
      email: req.body.email,
    };
    await User.create(userModel);
    return res.status(201).json({
      message: "User created",
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

const getUser = async (req: Request, res: Response, _: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const user = await User.findByPk(req.params.id, { raw: true });
    if (!user) {
      return res.status(200).json({
        message: "User not found",
      });
    }
    return res.status(200).json(user);
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

const updateUser = async (req: Request, res: Response, _: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const user = {
      firstName: req.body.firstName ?? null,
      lastName: req.body.lastName ?? null,
      email: req.body.email,
    };

    const filteredUser = Object.fromEntries(
      Object.entries(user).filter(([key, value]) => value !== null)
    );

    await User.update(filteredUser, {
      where: { id: req.params.id },
    });

    return res.status(200).json({
      message: "User updated",
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

const deleteUser = async (req: Request, res: Response, _: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    await User.destroy({ where: { id: req.params.id } });
    return res.status(200).json({
      message: "user deleted",
    });
  } catch (ex) {
    return res.status(500).json(ex);
  }
};

const getAllUsers = async (req: Request, res: Response, _: NextFunction) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
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

export default {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
