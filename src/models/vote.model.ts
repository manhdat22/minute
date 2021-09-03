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
import User from './user.model'

export const parentType = {
  post: 'post',
  comment: 'comment',
}

const VoteDefinition = {
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
  parentId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  parentType: {
    allowNull: false,
    type: DataTypes.STRING,
  },
}

export interface VoteAttributes {
  id?: number
  userId: number
  parentId: number
  parentType: string
}

export interface VoteCreationAttributes
  extends Optional<VoteAttributes, 'id'> {}

class Vote
  extends Model<VoteAttributes, VoteCreationAttributes>
  implements VoteAttributes
{
  id?: number
  userId: number
  parentId: number
  parentType: string

  private static readonly scopes: ModelScopeOptions = {}

  private static readonly validations: ModelValidateOptions = {}

  private static readonly hooks: Partial<ModelHooks<Vote>> = {}

  static initialize(sequelize: Sequelize): void {
    this.init(VoteDefinition, {
      sequelize,
      tableName: 'votes',
      updatedAt: true,
      createdAt: true,
      scopes: Vote.scopes,
      validate: Vote.validations,
      hooks: Vote.hooks,
    })
  }

  static associate(): void {
    Vote.belongsTo(User, {
      foreignKey: 'userId',
      constraints: false,
      as: 'user',
    })
    Vote.belongsTo(Post, {
      foreignKey: 'parentId',
      constraints: false,
      as: 'post',
    })
    Vote.belongsTo(Comment, {
      foreignKey: 'parentId',
      constraints: false,
      as: 'comment',
    })
  }
}

export default Vote
