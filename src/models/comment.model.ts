// tslint:disable-next-line: no-var-requires
require('dotenv').config()

import {
  Model,
  DataTypes,
  Optional,
  ModelScopeOptions,
  ModelValidateOptions,
  Sequelize,
  BelongsToGetAssociationMixin,
} from 'sequelize'
import { ModelHooks } from 'sequelize/types/lib/hooks'
import { CustomValidationError } from '../utils/exceptions/custom_validation_error'
import Post from './post.model'
import User from './user.model'
import Vote from './vote.model'

export const postId = {
  post: 'post',
  comment: 'comment',
}

const CommentDefinition = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  content: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  parentId: {
    type: DataTypes.INTEGER,
  },
  postId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
  },
}

export interface CommentAttributes {
  id?: number
  content: string
  userId: number
  parentId?: number
  postId: number
  isDeleted?: boolean
  post?: Post
}

export interface CommentCreationAttributes
  extends Optional<CommentAttributes, 'id'> {}

class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  id?: number
  content: string
  userId: number
  parentId?: number
  postId: number
  isDeleted?: boolean

  public getPost: BelongsToGetAssociationMixin<Post>
  public getUser: BelongsToGetAssociationMixin<User>

  public readonly user?: User

  public readonly post?: Post

  private static readonly scopes: ModelScopeOptions = {}

  private static readonly validations: ModelValidateOptions = {}

  private static readonly hooks: Partial<ModelHooks<Comment>> = {}

  static initialize(sequelize: Sequelize): void {
    this.init(CommentDefinition, {
      sequelize,
      tableName: 'comments',
      updatedAt: true,
      createdAt: true,
      scopes: Comment.scopes,
      validate: Comment.validations,
      hooks: Comment.hooks,
    })
  }

  static associate(): void {
    Comment.belongsTo(User, {
      foreignKey: 'userId',
      constraints: false,
      as: 'user',
    })
    Comment.belongsTo(Post, {
      foreignKey: 'postId',
      as: 'post',
    })
    Comment.belongsTo(Comment, {
      foreignKey: 'parentId',
      constraints: false,
      as: 'replies',
    })
    Comment.hasMany(Comment, {
      foreignKey: 'parentId',
      constraints: false,
      as: 'reply',
    })
    Comment.hasMany(Vote, {
      foreignKey: 'parentId',
      as: 'votes',
      scope: {
        parentType: 'comment',
      },
    })
  }
}

export default Comment
