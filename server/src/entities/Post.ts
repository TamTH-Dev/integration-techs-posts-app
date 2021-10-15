import { Field, ObjectType, ID } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  title!: string

  @Field()
  @Column()
  text!: string

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @CreateDateColumn()
  updatedAt: Date
}
