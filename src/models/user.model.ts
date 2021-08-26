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
import { Hooks, ModelHooks, SequelizeHooks } from 'sequelize/types/lib/hooks'
import { CustomValidationError } from '../utils/exceptions/custom_validation_error'

const UserDefinition = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  username: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  email: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  bio: {
    type: DataTypes.STRING,
  },
  token: {
    type: DataTypes.STRING,
  },
}

export interface UserAttributes {
  id?: number
  username: string
  email: string
  password: string
  bio?: string
  token?: string
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'bio'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  id?: number
  username: string
  email: string
  password: string
  bio?: string
  token?: string

  private static readonly scopes: ModelScopeOptions = {}

  private static readonly validations: ModelValidateOptions = {
    async validateEmail() {
      // need validation conditions
      if (!this.email) return

      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (!pattern.test(this.email.toLowerCase())) {
        throw new CustomValidationError('email', 'Invalid email.')
      }

      const otherUser = await User.findOne({ where: { email: this.email.toLowerCase() } })
      if (otherUser) {
        throw new CustomValidationError('email', 'Email existed.')
      }
    },

    async validateUsername() {
      // need validation conditions
      if (!this.username) return

      const pattern = /^\w{4,16}$/

      if (!pattern.test(this.username)) {
        throw new CustomValidationError('username', 'Invalid username.')
      }

      const otherUser = await User.findOne({ where: { username: this.username } })
      if (otherUser) {
        throw new CustomValidationError('username', 'Username existed.')
      }
    },
  }

  private static readonly hooks: Partial<ModelHooks<User>> = {}

  static initialize(sequelize: Sequelize): void {
    this.init(UserDefinition, {
      sequelize,
      tableName: 'users',
      underscored: true,
      updatedAt: true,
      createdAt: true,
      scopes: User.scopes,
      validate: User.validations,
      hooks: User.hooks,
    })
  }

  static associate(): void {
    // associate
  }
}

export default User
