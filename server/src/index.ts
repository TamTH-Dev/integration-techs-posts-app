require('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cors from 'cors'

import { User } from './entities/User'
import { Post } from './entities/Post'
import { UserResolver } from './resolvers/user'
import { PostResolver } from './resolvers/post'
import { COOKIE_NAME, __prod__ } from './constants'
import { Context } from './types/Context'
import { sendEmail } from './utils/sendEmail'

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'reddit',
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User, Post],
  })

  await sendEmail('demo@gmail.com', '<b>Hello world</b>')

  const app = express()

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  )

  // Session/Cookie store
  await mongoose.connect(process.env.SESSION_DB as string)
  console.log('Connected to Atlas')

  app.use(
    session({
      name: COOKIE_NAME,
      store: MongoStore.create({
        mongoUrl: process.env.SESSION_DB,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true, // JS frontend cannot access the cookie
        secure: __prod__, // Cookie only works in https
        sameSite: 'lax', // Protection against CSRF
      },
      secret: process.env.SESSION_SECRET as string,
      saveUninitialized: false, // Don't save empty sessions, right from the start
      resave: false,
    }),
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app, cors: false })

  const PORT = process.env.PORT || 4000
  app.listen(PORT, () =>
    console.log(
      `Server is listening on port ${PORT}\nGraphQL server started on localhost:${PORT}${apolloServer.graphqlPath}`,
    ),
  )
}

main().catch((error) => console.log(error))
