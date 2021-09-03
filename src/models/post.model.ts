// tslint:disable-next-line: no-var-requires
require('dotenv').config()

import {
  Model,
  DataTypes,
  Optional,
  ModelScopeOptions,
  ModelValidateOptions,
  Sequelize,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyCountAssociationsMixin,
} from 'sequelize'
import { ModelHooks } from 'sequelize/types/lib/hooks'
import { CustomValidationError } from '../utils/exceptions/custom_validation_error'
import Comment from './comment.model'
import Sub from './sub.model'
import Upload from './upload.model'
import User from './user.model'
import Vote from './vote.model'

const PostDefinition = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  title: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  slug: {
    type: DataTypes.STRING,
  },
  content: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  authorId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  subId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  mediaId: {
    type: DataTypes.INTEGER,
  },
}

export interface PostAttributes {
  id?: number
  title: string
  content: string
  authorId?: number
  subId?: number
  slug?: string
  mediaId?: number
  comments?: Comment[]
  commentCount?: number
  voteCount?: number
}

export interface PostCreationAttributes
  extends Optional<PostAttributes, 'id'> {}

class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  id?: number
  title: string
  content: string
  authorId?: number
  subId?: number
  mediaId?: number
  slug?: string

  public readonly comments?: Comment[]
  public readonly commentCount?: number
  public readonly voteCount?: number

  public getComments!: HasManyGetAssociationsMixin<Comment>
  public createComment: HasManyCreateAssociationMixin<Comment>
  public countComments: HasManyCountAssociationsMixin
  public countVotes: HasManyCountAssociationsMixin

  private static readonly scopes: ModelScopeOptions = {
    postAttributes(userId) {
      return {
        attributes: [
          'id',
          'title',
          'content',
          'slug',
          'subId',
          'createdAt',
          'updatedAt',
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM votes WHERE votes.parentId = Post.id AND votes.parentType = "post")',
            ),
            'voteCount',
          ],
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM comments WHERE comments.postId = Post.id)',
            ),
            'commentCount',
          ],
          [
            Sequelize.literal(
              `(SELECT EXISTS(SELECT * FROM votes WHERE votes.parentId = Post.id AND votes.parentType = "post" AND votes.userId = ${(userId ||=
                null)}))`,
            ),
            'voted',
          ],
        ],
      }
    },
  }

  private static readonly validations: ModelValidateOptions = {
    async validateTitle() {
      if (!this.name) return

      const pattern = /^.{8,255}$/

      if (!pattern.test(this.title)) {
        throw new CustomValidationError('title', 'Invalid title.')
      }
    },
  }

  private static readonly hooks: Partial<ModelHooks<Post>> = {
    beforeCreate: (post, options) => {
      Post.generateSlug(post)
    },
    beforeUpdate: (post, options) => {
      if (post.changed('title')) Post.generateSlug(post)
    },
  }

  static initialize(sequelize: Sequelize): void {
    this.init(PostDefinition, {
      sequelize,
      tableName: 'posts',
      updatedAt: true,
      createdAt: true,
      scopes: Post.scopes,
      validate: Post.validations,
      hooks: Post.hooks,
      defaultScope: {
        include: [
          {
            model: Upload,
            as: 'media',
          },
        ],
      },
    })
  }

  static associate(): void {
    Post.belongsTo(User, {
      foreignKey: 'authorId',
      as: 'author',
    })
    Post.belongsTo(Upload, {
      foreignKey: 'mediaId',
      as: 'media',
    })
    Post.belongsTo(Sub, {
      foreignKey: 'subId',
      as: 'sub',
    })
    Post.hasMany(Comment, {
      foreignKey: 'postId',
      as: 'comments',
    })
    Post.hasMany(Vote, {
      foreignKey: 'parentId',
      as: 'votes',
      scope: {
        parentType: 'post',
      },
    })
  }

  private static generateSlug = (post: Post) => {
    post.slug = post.title
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
      )
      .map((x) => x.toLowerCase())
      .concat(Math.random().toString(36).substr(2, 4))
      .join('-')
  }
}

export default Post
