import { Field, ObjectType, ID } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from './User'
import { Vote } from './Vote'

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  title!: string

  @Field()
  @Column()
  text!: string

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @Field()
  @Column()
  userId!: number

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  user!: User

  @Field(() => [Vote])
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[]

  @Field()
  @Column({ default: 0 })
  points!: number

  @Field()
  voteType!: number
}
