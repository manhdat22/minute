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
import Post from './post.model'
import Upload from './upload.model'

const PostMediaDefinition = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  uploadId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  postId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
}

export interface PostMediaAttributes {
  id?: number
  uploadId: number
  postId: number
}

export interface PostMediaCreationAttributes
  extends Optional<PostMediaAttributes, 'id'> {}

class PostMedia
  extends Model<PostMediaAttributes, PostMediaCreationAttributes>
  implements PostMediaAttributes
{
  id?: number
  uploadId: number
  postId: number

  private static readonly scopes: ModelScopeOptions = {}

  private static readonly validations: ModelValidateOptions = {}

  private static readonly hooks: Partial<ModelHooks<PostMedia>> = {}

  static initialize(sequelize: Sequelize): void {
    this.init(PostMediaDefinition, {
      sequelize,
      tableName: 'postMedias',
      updatedAt: true,
      createdAt: true,
      scopes: PostMedia.scopes,
      validate: PostMedia.validations,
      hooks: PostMedia.hooks,
    })
  }

  static associate(): void {
    PostMedia.belongsTo(Post)
    PostMedia.belongsTo(Upload)
  }
}

export default PostMedia
