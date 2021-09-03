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
import Comment from './comment.model'
import Post from './post.model'
import Sub from './sub.model'
import User from './user.model'

export const uploadType = {
  post: 'post',
  userAvatar: 'userAvatar',
  subIcon: 'subIcon',
}

const UploadDefinition = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  url: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  uploadType: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
}

export interface UploadAttributes {
  id?: number
  url: string
  uploadType: string
}

export interface UploadCreationAttributes
  extends Optional<UploadAttributes, 'id'> {}

class Upload
  extends Model<UploadAttributes, UploadCreationAttributes>
  implements UploadAttributes
{
  id?: number
  url: string
  uploadType: string

  private static readonly scopes: ModelScopeOptions = {}

  private static readonly validations: ModelValidateOptions = {}

  private static readonly hooks: Partial<ModelHooks<Upload>> = {}

  static initialize(sequelize: Sequelize): void {
    this.init(UploadDefinition, {
      sequelize,
      tableName: 'uploads',
      updatedAt: true,
      createdAt: true,
      scopes: Upload.scopes,
      validate: Upload.validations,
      hooks: Upload.hooks,
    })
  }

  static associate(): void {
    Upload.hasOne(User, {
      foreignKey: 'avatarId',
      as: 'user',
    })

    Upload.hasOne(Sub, {
      foreignKey: 'iconId',
      as: 'sub',
    })

    Upload.hasOne(Post, {
      foreignKey: 'mediaId',
      as: 'media',
    })
  }
}

export default Upload
