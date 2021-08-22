import { Error } from 'sequelize'

export class CustomSequelizeError extends Error {
  public field: string

  constructor(message: string, field?: string) {
    super(message)

    this.field = field
  }
}
