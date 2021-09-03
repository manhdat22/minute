// tslint:disable-next-line: no-var-requires
require('dotenv').config()

import {
  Model,
  DataTypes,
  Optional,
  ModelScopeOptions,
  ModelValidateOptions,
  Sequelize,
} from 'sequelize'
import { ModelHooks } from 'sequelize/types/lib/hooks'
import { CustomValidationError } from '../utils/exceptions/custom_validation_error'
import Sub from './sub.model'
import User from './user.model'

export const roles = {
  admin: 0,
  moderator: 1,
  subscriber: 2,
}

const UserSubDefinition = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  subId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  role: {
    type: DataTypes.ENUM('admin', 'moderator', 'subscriber'),
    defaultValue: 'subscriber',
  },
}

export interface UserSubAttributes {
  id?: number
  userId: number
  subId: number
  role: number
}

export interface UserSubCreationAttributes
  extends Optional<UserSubAttributes, 'id'> {}

class UserSub
  extends Model<UserSubAttributes, UserSubCreationAttributes>
  implements UserSubAttributes
{
  id?: number
  userId: number
  subId: number
  role: number

  private static readonly scopes: ModelScopeOptions = {}

  private static readonly validations: ModelValidateOptions = {}

  private static readonly hooks: Partial<ModelHooks<UserSub>> = {}

  static initialize(sequelize: Sequelize): void {
    this.init(UserSubDefinition, {
      sequelize,
      tableName: 'userSubs',
      updatedAt: true,
      createdAt: true,
      scopes: UserSub.scopes,
      validate: UserSub.validations,
      hooks: UserSub.hooks,
    })
  }

  static associate(): void {
    UserSub.belongsTo(User)
    UserSub.belongsTo(Sub)
  }
}

export default UserSub
