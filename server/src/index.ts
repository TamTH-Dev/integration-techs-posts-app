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
import path from 'path'

import { User } from './entities/User'
import { Post } from './entities/Post'
import { Vote } from './entities/Vote'
import { UserResolver } from './resolvers/user'
import { PostResolver } from './resolvers/post'
import { COOKIE_NAME, __prod__ } from './constants'
import { Context } from './types/Context'
import { buildDataLoaders } from './utils/dataLoaders'

const main = async () => {
  const connection = await createConnection({
    type: 'postgres',
    logging: true,
    entities: [User, Post, Vote],
    migrations: [path.join(__dirname, '/migrations/*')],
    ...(__prod__
      ? {
          url: process.env.DATABASE_URL,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
          ssl: true,
        }
      : {
          database: 'reddit',
          username: process.env.DB_USERNAME_DEV,
          password: process.env.DB_PASSWORD_DEV,
          synchronize: true,
        }),
  })

  if (__prod__) await connection.runMigrations()

  const app = express()

  app.use(
    cors({
      origin: __prod__
        ? process.env.CORS_ORIGIN_PROD
        : process.env.CORS_ORIGIN_DEV,
      credentials: true,
    }),
  )

  // Session/Cookie store
  await mongoose.connect(process.env.SESSION_DB as string)
  console.log('Connected to Atlas')

  app.set('trust proxy', 1)

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
        sameSite: 'none', // Protection against CSRF
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
    context: ({ req, res }): Context => ({
      req,
      res,
      connection,
      dataLoaders: buildDataLoaders(),
    }),
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
