import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'

import { Post } from './Post'
import { User } from './User'

@ObjectType()
@Entity()
export class Vote extends BaseEntity {
  @Field()
  @PrimaryColumn()
  userId: number

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.votes)
  user!: User

  @Field()
  @PrimaryColumn()
  postId!: number

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.votes)
  post!: Post

  @Column()
  value!: number
}
