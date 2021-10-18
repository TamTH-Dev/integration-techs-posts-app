import { Field, ObjectType } from 'type-graphql'

import { Post } from '../entities/Post'

@ObjectType()
export class PaginatedPosts {
  @Field()
  totalCount!: number

  @Field(() => Date)
  cursor!: Date

  @Field()
  hasMore!: boolean

  @Field(() => [Post])
  paginatedPosts!: Post[]
}
