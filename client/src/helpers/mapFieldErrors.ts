import { FieldError } from '../generated/graphql'

export const mapFieldErrors = (errors: FieldError[]): { [key: string]: any } =>
  errors.reduce(
    (errorsObject, error) => ({
      ...errorsObject,
      [error.field]: error.message,
    }),
    {},
  )
