import { Request, Response, NextFunction } from "express";
import { Share } from "../models/share-model";
import { Portfolio } from "../models/portfolio-model";
import { Sale, TransactionTypes } from "../models/sale-model";
import { db } from "../utils/db";
import { Op } from "sequelize";
import { validationResult } from "express-validator";

const sell = async (req: Request, res: Response, _: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const shareId = req.body?.shareId.toUpperCase();
  const portfolioId = req.body?.portfolioId;
  const amount = req.body?.amount;
  try {
    const share = Share.findByPk(shareId);
    if (!share) {
      return res.status(400).json({
        message: `There is no share registred with the id of ${shareId}`,
      });
    }

    const portfolio = Portfolio.findByPk(portfolioId);
    if (!portfolio) {
      return res.status(400).json({
        message: `There is no portfolio registred with the id of ${portfolioId}`,
      });
    }

    const shareInPortfolio = await Sale.findOne({
      where: { shareId, portfolioId },
    });

    if (!shareInPortfolio) {
      return res.status(400).json({
        message: `There is not share with the id of ${shareId} registred with the portfolio`,
      });
    }

    type SummaryType = Sale & { total: number };
    const salesSum = (await Sale.findAll({
      where: { shareId },
      attributes: ["operationType", [db.fn("SUM", db.col("amount")), "total"]],
      group: "operationType",
      having: {
        operationType: {
          [Op.in]: [TransactionTypes.Buy, TransactionTypes.Sell],
        },
      },
      raw: true,
    })) as SummaryType[];

    const buy = salesSum.find((j) => j.operationType === TransactionTypes.Buy);
    const sell = salesSum.find(
      (j) => j.operationType === TransactionTypes.Sell
    );

    if (!buy) {
      return res.status(400).json({
        message: "Not enough share to sell",
      });
    }

    if (sell && Number(sell?.total) + amount > Number(buy?.total)) {
      return res.status(400).json({
        message: "Not enough share to sell",
      });
    }

    await Sale.create({
      portfolioId,
      shareId,
      operationType: TransactionTypes.Sell,
      amount,
    });
    return res.status(200).json({
      message: `Share ${shareId} sold`,
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

const buy = async (req: Request, res: Response, _: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const shareId = req.body?.shareId.toUpperCase();
  const portfolioId = req.body?.portfolioId;
  const amount = req.body?.amount;

  try {
    const share = Share.findByPk(shareId);
    if (!share) {
      return res.status(400).json({
        message: `There is no share registred with the id of ${shareId}`,
      });
    }

    const portfolio = Portfolio.findByPk(portfolioId);
    if (!portfolio) {
      return res.status(400).json({
        message: `There is no portfolio registred with the id of ${portfolioId}`,
      });
    }

    await Sale.create({
      portfolioId,
      shareId,
      operationType: TransactionTypes.Buy,
      amount,
    });

    return res.status(200).json({
      message: `Share with the id of ${shareId} bought`,
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

export default { sell, buy };
