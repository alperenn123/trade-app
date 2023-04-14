import { Model, DataTypes, Sequelize, Association, Optional } from "sequelize";
import { User } from "./user-model";

const TABLE_NAME = "portfolio";

export interface PortfolioAttributes {
  id?: number;
  userId: number;
}

export type PortfolioCreationAttributes = Optional<PortfolioAttributes, "id">;

export class Portfolio extends Model<
  PortfolioAttributes,
  PortfolioCreationAttributes
> {
  public id?: number;
  public userId!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static initialize(sequelize: any) {
    Portfolio.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: "id",
          },
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
