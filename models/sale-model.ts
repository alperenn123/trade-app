import { Model, DataTypes, Optional } from "sequelize";

const TABLE_NAME = "sale";

export enum TransactionTypes {
  Buy = "buy",
  Sell = "sell",
}
export interface SaleAttributes {
  id?: number;
  portfolioId: number;
  shareId: string;
  operationType: TransactionTypes;
  amount: number;
}

type SaleCreationAttributes = Optional<SaleAttributes, "id">;

export class Sale extends Model<SaleAttributes, SaleCreationAttributes> {
  public id?: number;
  public portfolioId!: number;
  public shareId!: string;
  public operationType!: TransactionTypes;
  public amount!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: any) {
    Sale.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        portfolioId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "portfolio",
            key: "id",
          },
        },
        shareId: {
          type: DataTypes.STRING(3),
          allowNull: false,
          references: {
            model: "share",
            key: "id",
          },
        },
        operationType: {
          type: DataTypes.ENUM(...Object.values(TransactionTypes)),
          allowNull: false,
        },
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: TABLE_NAME,
        timestamps: true,
      }
    );
  }
}
