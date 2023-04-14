import { Model, DataTypes, Optional } from "sequelize";

const TABLE_NAME = "user";

export interface UserAttributes {
  id?: number;
  firstName?: string;
  lastName?: string;
  email: string;
}
type UserCreationAttributes = Optional<UserAttributes, "id">;

export class User extends Model<UserAttributes, UserCreationAttributes> {
  public id?: number;
  public firstName?: string;
  public lastName?: string;
  public email!: string;
  static initialize(sequelize: any) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        tableName: TABLE_NAME,
        timestamps: true,
      }
    );
  }
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
