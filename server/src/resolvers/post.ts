import { Arg, Mutation, Resolver, Query, ID, UseMiddleware } from 'type-graphql'

import { Post } from '../entities/Post'
import { CreatePostInput } from '../types/CreatePostInput'
import { UpdatePostInput } from '../types/UpdatePostInput'
import { PostMutationResponse } from '../types/PostMutationResponse'
import { checkAuth } from '../middleware/checkAuth'

@Resolver()
export class PostResolver {
  @Mutation((_return) => PostMutationResponse)
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
