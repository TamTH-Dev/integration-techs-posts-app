import { getModelForClass, prop } from '@typegoose/typegoose'
import { Types } from 'mongoose'

export class Token {
  _id!: Types.ObjectId

  @prop({ required: true })
  userId!: string

  @prop({ required: true })
  token!: string

  @prop({ default: Date.now, expires: 60 * 5 })
  createdAt: Date
}

export const TokenModel = getModelForClass(Token)
