// tslint:disable-next-line: no-var-requires
require('dotenv').config()

import {
  Model,
  DataTypes,
  Optional,
  ModelScopeOptions,
  ModelValidateOptions,
  Sequelize,
  HasManyCreateAssociationMixin,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
} from 'sequelize'
import { ModelHooks } from 'sequelize/types/lib/hooks'
import { CustomValidationError } from '../utils/exceptions/custom_validation_error'

import Comment from './comment.model'
import Post from './post.model'
import Sub from './sub.model'
import Upload from './upload.model'
import UserSub from './user_sub.model'
import Vote from './vote.model'

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
  avatarId: {
    type: DataTypes.INTEGER,
  },
}

export interface UserAttributes {
  id?: number
  username: string
  email: string
  password: string
  bio?: string
  token?: string
  avatarId?: number
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'bio' | 'avatarId'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  id?: number
  username: string
  email: string
  password: string
  bio?: string
  token?: string
  avatarId?: number

  public readonly avatar?: string
  public readonly posts?: Post[]
  public readonly totalPost?: number

  public getAvatar!: HasOneGetAssociationMixin<Upload>

  private static readonly scopes: ModelScopeOptions = {}

  private static readonly validations: ModelValidateOptions = {
    async validateEmail() {
      if (!this.email) return

      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (!pattern.test(this.email.toLowerCase())) {
        throw new CustomValidationError('email', 'Invalid email.')
      }

      const otherUser = await User.findOne({
        where: { email: this.email.toLowerCase() },
      })
      if (otherUser) {
        throw new CustomValidationError('email', 'Email existed.')
      }
    },

    async validateUsername() {
      if (!this.username) return

      const pattern = /^\w{4,16}$/

      if (!pattern.test(this.username)) {
        throw new CustomValidationError('username', 'Invalid username.')
      }

      const otherUser = await User.findOne({
        where: { username: this.username },
      })
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
      updatedAt: true,
      createdAt: true,
      scopes: User.scopes,
      validate: User.validations,
      hooks: User.hooks,
      defaultScope: {
        include: { model: Upload, as: 'avatar' },
      },
    })
  }

  static associate(): void {
    User.hasMany(Comment)
    User.hasMany(Post, { as: 'posts', foreignKey: 'authorId' })
    User.hasMany(UserSub)
    User.hasMany(Vote)

    User.belongsTo(Upload, { foreignKey: 'avatarId', as: 'avatar' })
  }
}

export default User
