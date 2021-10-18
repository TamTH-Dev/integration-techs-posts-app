import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import argon2 from 'argon2'
import { v4 as uuidv4 } from 'uuid'

import { User } from '../entities/User'
import { UserMutationResponse } from '../types/UserMutationResponse'
import { RegisterInput } from '../types/RegisterInput'
import { LoginInput } from '../types/LoginInput'
import { validateRegisterInput } from '../utils/validateRegisterInput'
import { Context } from '../types/Context'
import { COOKIE_NAME } from '../constants'
import { ForgotPasswordInput } from '../types/ForgotPasswordInput'
import { sendEmail } from '../utils/sendEmail'
import { TokenModel } from '../models/Token'
import { ChangePasswordInput } from '../types/ChangePasswordInput'

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: Context) {
    return req.session.userId === user.id ? user.email : ''
  }

  @Query((_return) => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | undefined | null> {
    const { userId } = req.session
    if (!userId) return null
    const user = await User.findOne(userId)
    return user
  }

  @Mutation((_return) => UserMutationResponse)
  async register(
    @Arg('registerInput') registerInput: RegisterInput,
    @Ctx() { req }: Context,
  ): Promise<UserMutationResponse> {
    try {
      const validateRegisterInputErrors = validateRegisterInput(registerInput)
      if (validateRegisterInputErrors) {
        return {
          code: 400,
          success: false,
          ...validateRegisterInputErrors,
        }
      }
      const { username, email, password } = registerInput
      const existingUser = await User.findOne({
        where: [{ username }, { email }],
      })
      // If user exist then stop registering process
      if (existingUser) {
        return {
          code: 400,
          success: false,
          message: 'User already existed',
          errors: [
            {
              field: existingUser.username === username ? 'username' : 'email',
              message:
                existingUser.username === username
                  ? 'Username already taken'
                  : 'Email already taken',
            },
          ],
        }
      }
      // Hash password
      const hashedPassword = await argon2.hash(password)
      // Create new user instance
      const newUser = User.create({
        email,
        username,
        password: hashedPassword,
      })
      await newUser.save()
      req.session.userId = newUser.id
      return {
        code: 201,
        success: true,
        message: 'User registered successfully!',
        user: newUser,
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      }
    }
  }

  @Mutation((_return) => UserMutationResponse)
  async login(
    @Arg('loginInput') loginInput: LoginInput,
    @Ctx() { req }: Context,
  ): Promise<UserMutationResponse> {
    try {
      const { usernameOrEmail, password } = loginInput
      const existingUser = await User.findOne(
        usernameOrEmail.includes('@')
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail },
      )
      if (!existingUser) {
        return {
          code: 400,
          success: false,
          message: 'User not found',
          errors: [
            {
              field: 'usernameOrEmail',
              message: 'Username or email does not exist',
            },
          ],
        }
      }
      const passwordValid = await argon2.verify(existingUser.password, password)
      if (!passwordValid) {
        return {
          code: 400,
          success: false,
          message: 'Wrong password',
          errors: [{ field: 'password', message: 'Wrong password' }],
        }
      }

      // Create session and return cookie
      req.session.userId = existingUser.id

      return {
        code: 200,
        success: true,
        message: 'Logged in successfully',
        user: existingUser,
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      }
    }
  }

  @Mutation((_return) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME)
      req.session.destroy((error) => {
        if (error) {
          console.log('SESSION ERROR', error)
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  @Mutation((_return) => Boolean)
  async forgotPassword(
    @Arg('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
  ): Promise<boolean> {
    try {
      const user = await User.findOne({ email: forgotPasswordInput.email })
      if (!user) return true

      // Delete duplicate token
      await TokenModel.findOneAndDelete({ userId: user.id.toString() })

      // Create new token
      const resetToken = uuidv4()
      const hashedResetToken = await argon2.hash(resetToken)

      // Save token to database
      const newToken = new TokenModel({
        userId: user.id.toString(),
        token: hashedResetToken,
      })
      await newToken.save()

      // Send mail to user
      await sendEmail(
        forgotPasswordInput.email,
        `<a href="http://localhost:3000/change-password?token=${resetToken}&userId=${user.id}">Click here to reset your password</a>`,
      )
    } catch (error) {
      console.error(error)
    }
    return true
  }

  @Mutation((_return) => UserMutationResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('userId') userId: string,
    @Arg('changePasswordInput') changePasswordInput: ChangePasswordInput,
    @Ctx() { req }: Context,
  ): Promise<UserMutationResponse> {
    if (changePasswordInput.newPassword.length <= 2) {
      return {
        code: 400,
        success: false,
        message: 'Invalid password',
        errors: [
          {
            field: 'newPassword',
            message: 'Length must be greater than 2',
          },
        ],
      }
    }
    try {
      const resetPasswordTokenRecord = await TokenModel.findOne({ userId })
      if (!resetPasswordTokenRecord) {
        return {
          code: 400,
          success: false,
          message: 'Invalid or expired password reset token',
          errors: [
            {
              field: 'token',
              message: 'Invalid or expired password reset token',
            },
          ],
        }
      }
      const resetPasswordTokenValid = argon2.verify(
        resetPasswordTokenRecord.token,
        token,
      )
      if (!resetPasswordTokenValid) {
        return {
          code: 400,
          success: false,
          message: 'Invalid or expired password reset token',
          errors: [
            {
              field: 'token',
              message: 'Invalid or expired password reset token',
            },
          ],
        }
      }
      const parsedUserId = parseInt(userId)
      const user = await User.findOne(parsedUserId)
      if (!user) {
        return {
          code: 400,
          success: false,
          message: 'User no longer exists',
          errors: [
            {
              field: 'token',
              message: 'User no longer exists',
            },
          ],
        }
      }
      const updatedPassword = await argon2.hash(changePasswordInput.newPassword)
      await User.update({ id: parsedUserId }, { password: updatedPassword })
      await resetPasswordTokenRecord.deleteOne()
      req.session.userId = user.id
      return {
        code: 200,
        success: true,
        message: 'User password reset successfully',
        user,
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      }
    }
  }
}
