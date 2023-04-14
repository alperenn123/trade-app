import { Sequelize } from "sequelize";
import { Share } from "../models/share-model";
import {
  Portfolio,
  PortfolioCreationAttributes,
} from "../models/portfolio-model";
import { User } from "../models/user-model";
import { Sale, TransactionTypes, SaleAttributes } from "../models/sale-model";
import portfolio from "../controllers/portfolio";

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

const db = new Sequelize({
  dialect: "postgres",
  host: dbHost,
  username: dbUser,
  password: dbPassword,
  database: dbName,
  logging: console.log,
});

// init the tables
Share.initialize(db);
User.initialize(db);
Portfolio.initialize(db);
Sale.initialize(db);

// create relations
User.hasOne(Portfolio, {
  foreignKey: "userId",
  as: "portfolio",
});

Portfolio.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Portfolio.hasMany(Sale, {
  foreignKey: "portfolioId",
  onDelete: "CASCADE",
});

Sale.belongsTo(Portfolio, { foreignKey: "portfolioId" });

async function initDb() {
  try {
    await db.sync({ force: true });
    const userData = [
      { firstName: "John", lastName: "Doe", email: "john.doe@example.com" },
      { firstName: "Jane", lastName: "Doe", email: "jane.doe@example.com" },
      {
        firstName: "Bob",
        lastName: "Smith",
        email: "bob.smith@example.com",
      },
      {
        firstName: "Alice",
        lastName: "Johns",
        email: "alice.johns@example.com",
      },
      {
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie.brown@example.com",
      },
    ];

    const createdUsers = await User.bulkCreate(userData, {
      returning: true,
    });

    if (!createdUsers) {
      console.error("Could not create the users");
      return;
    }

    const userPortfolios: PortfolioCreationAttributes[] = createdUsers.map(
      (user) => {
        return {
          userId: user.id,
        } as PortfolioCreationAttributes;
      }
    );

    const createdPortfolios = await Portfolio.bulkCreate(userPortfolios, {
      returning: true,
    });

    const createdShares = await Share.bulkCreate(
      [
        {
          id: "ABC",
          price: 10,
        },
        { id: "CDE", price: 20 },
        { id: "FPE", price: 30 },
        { id: "DPE", price: 40 },
        { id: "SEA", price: 50 },
      ],
      { returning: true }
    );
    if (!createdShares) {
      console.error("Could not create the shares");
      return;
    }
    const jsonShares = createdShares.map((createdShare) =>
      createdShare.toJSON()
    );

    const saleData = createdPortfolios
      .map((portfolio) => portfolio.toJSON())
      .map((portfolio, idx) => {
        return {
          shareId: jsonShares[idx % 2].id,
          portfolioId: portfolio.id,
          amount: 10 * idx,
          operationType: TransactionTypes.Buy,
        } as SaleAttributes;
      });
    if (!saleData) {
      console.error("Could not create the shares");
      return;
    }
    await Sale.bulkCreate(saleData, { returning: true });
  } catch (ex) {
    console.log(ex);
  }
}

export { db, initDb };
