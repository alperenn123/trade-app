import { Model, DataTypes, Sequelize, Optional } from "sequelize";

const TABLE_NAME = "share";

export interface ShareAttributes {
  id?: string;
  price: number;
}

export type ShareCreationnAttributes = Optional<ShareAttributes, "id">;

export class Share extends Model<ShareAttributes, ShareCreationnAttributes> {
  public id?: string;
  public price!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static initialize(sequelize: any) {
    Share.init(
      {
        id: {
          type: DataTypes.STRING(3),
          primaryKey: true,
        },
        price: {
          type: DataTypes.DECIMAL(2),
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
