import {
  Arg,
  Mutation,
  Resolver,
  Query,
  ID,
  UseMiddleware,
  FieldResolver,
  Root,
  Int,
  Ctx,
  registerEnumType,
} from 'type-graphql'
import { LessThan } from 'typeorm'
import { UserInputError } from 'apollo-server-core'

import { Post } from '../entities/Post'
import { CreatePostInput } from '../types/CreatePostInput'
import { UpdatePostInput } from '../types/UpdatePostInput'
import { PostMutationResponse } from '../types/PostMutationResponse'
import { checkAuth } from '../middleware/checkAuth'
import { User } from '../entities/User'
import { PaginatedPosts } from '../types/PaginatedPosts'
import { Context } from '../types/Context'
import { VoteType } from '../types/VoteType'
import { Vote } from '../entities/Vote'

registerEnumType(VoteType, {
  name: 'VoteType',
})

@Resolver((_of) => Post)
export class PostResolver {
  // Must explicit specify the object entity for resolver
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post): string {
    return root.text.slice(0, 50)
  }

  @FieldResolver(() => User)
  async user(
    @Root() root: Post,
    @Ctx() { dataLoaders: { userLoader } }: Context,
  ): Promise<User | undefined> {
    return await userLoader.load(root.userId)
  }

  @FieldResolver(() => Int)
  async voteType(
    @Root() root: Post,
    @Ctx() { req, dataLoaders: { voteTypeLoader } }: Context,
  ): Promise<number> {
    if (!req.session.userId) return 0
    const existingVote = await voteTypeLoader.load({
      postId: root.id,
      userId: req.session.userId,
    })
    return existingVote ? existingVote.value : 0
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async createPost(
    @Arg('createPostInput') { title, text }: CreatePostInput,
    @Ctx() { req }: Context,
  ): Promise<PostMutationResponse> {
    try {
      const newPost = Post.create({
        title,
        text,
        userId: req.session.userId,
      })
      await newPost.save()
      return {
        code: 200,
        success: true,
        message: 'Post created successfully',
        post: newPost,
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      }
    }
  }

  @Query(() => PaginatedPosts, { nullable: true })
  async getPosts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', { nullable: true }) cursor?: string,
  ): Promise<PaginatedPosts | null> {
    try {
      const totalCount = await Post.count()
      const realLimit = Math.min(10, limit)
      const findOptions: { [key: string]: any } = {
        order: {
          createdAt: 'DESC',
        },
        take: realLimit,
      }
      let lastPost: Post[] = []
      if (cursor) {
        findOptions.where = {
          createdAt: LessThan(cursor),
        }
        lastPost = await Post.find({ order: { createdAt: 'ASC' }, take: 1 })
      }
      const posts = await Post.find(findOptions)
      return {
        hasMore: cursor
          ? posts[posts.length - 1].createdAt.toString() !==
            lastPost[0].createdAt.toString()
          : posts.length !== totalCount,
        totalCount,
        paginatedPosts: posts,
        cursor: posts[posts.length - 1].createdAt,
      }
    } catch (error) {
      return null
    }
  }

  @Query(() => Post, { nullable: true })
  async getPost(
    @Arg('id', (_type) => ID!) id: number,
  ): Promise<Post | undefined | null> {
    try {
      return await Post.findOne(id)
    } catch (error) {
      return null
    }
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async updatePost(
    @Arg('updatePostInput') { id, title, text }: UpdatePostInput,
    @Ctx() { req }: Context,
  ): Promise<PostMutationResponse> {
    try {
      const existingPost = await Post.findOne(id)
      if (!existingPost) {
        return {
          code: 400,
          success: false,
          message: 'Post not found',
        }
      }
      if (existingPost.userId !== req.session.userId) {
        return {
          code: 403,
          success: false,
          message: 'Unauthorized',
        }
      }
      existingPost.title = title
      existingPost.text = text
      await existingPost.save()
      return {
        code: 204,
        success: true,
        message: 'Post updated successfully',
        post: existingPost,
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      }
    }
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async deletePost(
    @Arg('id', (_type) => ID!) id: number,
    @Ctx() { req }: Context,
  ): Promise<PostMutationResponse> {
    try {
      const existingPost = await Post.findOne(id)
      if (!existingPost) {
        return {
          code: 400,
          success: false,
          message: 'Post not found',
        }
      }
      if (existingPost.userId !== req.session.userId) {
        return {
          code: 403,
          success: false,
          message: 'Unauthorized',
        }
      }
      await Post.delete({ id })
      return {
        code: 200,
        success: true,
        message: 'Post deleted successfully',
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      }
    }
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('voteValue', () => VoteType) voteValue: VoteType,
    @Ctx() { req, connection }: Context,
  ): Promise<PostMutationResponse> {
    try {
      return await connection.transaction(async (transactionEntityManager) => {
        let post = await transactionEntityManager.findOne(Post, postId)
        // Check whether post existed
        if (!post) throw new UserInputError('Post not found')

        const userId = req.session.userId

        const existingVote = await transactionEntityManager.findOne(Vote, {
          postId,
          userId,
        })

        if (existingVote && existingVote.value !== voteValue) {
          await transactionEntityManager.save(Vote, {
            ...existingVote,
            value: voteValue,
          })
          post = await transactionEntityManager.save(Post, {
            ...post,
            points: post.points + 2 * voteValue,
          })
        }

        if (!existingVote) {
          const newVote = transactionEntityManager.create(Vote, {
            userId,
            postId,
            value: voteValue,
          })
          // Save vote record to db
          await transactionEntityManager.save(newVote)

          // Change points following user's action
          post.points = post.points + voteValue
          post = await transactionEntityManager.save(post)
        }

        return {
          code: 200,
          success: true,
          message: 'Post voted',
          post,
        }
      })
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      }
    }
  }
}
