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
import Post from './post.model'
import Upload from './upload.model'
import UserSub from './user_sub.model'

const SubDefinition = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    unique: true,
    type: DataTypes.STRING,
  },
  slug: {
    unique: true,
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  iconId: {
    type: DataTypes.INTEGER,
  },
}

export interface SubAttributes {
  id?: number
  name: string
  slug?: string
  description?: string
  iconId?: number
}

export interface SubCreationAttributes
  extends Optional<SubAttributes, 'id' | 'description' | 'slug'> {}

class Sub
  extends Model<SubAttributes, SubCreationAttributes>
  implements SubAttributes
{
  id?: number
  name: string
  slug?: string
  description?: string
  iconId?: number

  private static readonly scopes: ModelScopeOptions = {}

  private static readonly validations: ModelValidateOptions = {
    async validateName() {
      if (!this.name) return

      const pattern = /^.{4,32}$/

      if (!pattern.test(this.name)) {
        throw new CustomValidationError('name', 'Invalid name.')
      }

      const otherSub = await Sub.findOne({ where: { name: this.name } })
      if (otherSub) {
        throw new CustomValidationError('name', 'Name existed.')
      }
    },
  }

  private static readonly hooks: Partial<ModelHooks<Sub>> = {
    beforeCreate: (sub, options) => {
      Sub.generateSlug(sub)
    },
  }

  static initialize(sequelize: Sequelize): void {
    this.init(SubDefinition, {
      sequelize,
      tableName: 'subs',
      updatedAt: true,
      createdAt: true,
      scopes: Sub.scopes,
      validate: Sub.validations,
      hooks: Sub.hooks,
      defaultScope: {
        include: { model: Upload, as: 'icon' },
      },
    })
  }

  static associate(): void {
    Sub.hasMany(UserSub)
    Sub.hasMany(Post, { as: 'posts' })

    Sub.belongsTo(Upload, {
      foreignKey: 'iconId',
      as: 'icon',
    })
  }

  private static generateSlug = (sub: Sub) => {
    sub.slug = sub.name
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
      )
      .map((x) => x.toLowerCase())
      .join('-')
  }
}

export default Sub
