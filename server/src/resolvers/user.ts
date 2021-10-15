import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import argon2 from 'argon2'

import { User } from '../entities/User'
import { UserMutationResponse } from '../types/UserMutationResponse'
import { RegisterInput } from '../types/RegisterInput'
import { LoginInput } from '../types/LoginInput'
import { validateRegisterInput } from '../utils/validateRegisterInput'
import { Context } from '../types/Context'
import { COOKIE_NAME } from '../constants'

@Resolver()
export class UserResolver {
  @Query((_return) => String)
  demo(): string {
    return 'Hello world'
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
              message: 'Username or email alreayd taken',
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
}
