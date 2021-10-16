import { FieldError } from '../generated/graphql'

export const mapFieldErrors = (errors: FieldError[]) =>
  errors.reduce(
    (errorsObject, error) => ({
      ...errorsObject,
      [error.field]: error.message,
    }),
    {},
  )
