import {
  Arg,
  Mutation,
  Resolver,
  Query,
  ID,
  UseMiddleware,
  FieldResolver,
  Root,
} from 'type-graphql'

import { Post } from '../entities/Post'
import { CreatePostInput } from '../types/CreatePostInput'
import { UpdatePostInput } from '../types/UpdatePostInput'
import { PostMutationResponse } from '../types/PostMutationResponse'
import { checkAuth } from '../middleware/checkAuth'
import { User } from '../entities/User'

@Resolver((_of) => Post)
export class PostResolver {
  // Must explicit specify the object entity for resolver
  @FieldResolver((_return) => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50)
  }

  @FieldResolver((_return) => User)
  async user(@Root() root: Post) {
    return await User.findOne(root.userId)
  }

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async createPost(
    @Arg('createPostInput') { title, text }: CreatePostInput,
  ): Promise<PostMutationResponse> {
    try {
      const newPost = Post.create({
        title,
        text,
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

  @Query((_return) => [Post], { nullable: true })
  async getPosts(): Promise<Post[] | null> {
    try {
      return await Post.find()
    } catch (error) {
      return null
    }
  }

  @Query((_return) => Post, { nullable: true })
  async getPost(
    @Arg('id', (_type) => ID!) id: number,
  ): Promise<Post | undefined | null> {
    try {
      return await Post.findOne(id)
    } catch (error) {
      return null
    }
  }

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async updatePost(
    @Arg('updatePostInput') { id, title, text }: UpdatePostInput,
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

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async deletePost(
    @Arg('id', (_type) => ID!) id: number,
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
}
