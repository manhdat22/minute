import { ValidationErrorItem } from 'sequelize'

export class CustomValidationError extends ValidationErrorItem {
  public field: string
  public message: string

  constructor(field: string, message: string) {
    super(message, null, field)
    this.message = message
    this.field = field
  }
}
