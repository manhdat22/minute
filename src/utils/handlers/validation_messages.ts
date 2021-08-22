import { ValidationError } from 'sequelize'
import { CustomSequelizeError } from '../exceptions/custom_sequelize_error'

type ValidationMessages = { errors: { [key: string]: string[] } }

export const validationMessages = (e: ValidationError): ValidationMessages => {
  const errorMessages: { [key: string]: string[] } = {}

  e.errors.forEach((item) => {
    const originalError = item.original as CustomSequelizeError

    if (originalError) {
      errorMessages[originalError.field] ||= []
      errorMessages[originalError.field].push(originalError.message)
    }
  })

  return { errors: errorMessages }
}
