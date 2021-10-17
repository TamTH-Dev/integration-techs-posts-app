import { InputType, Field } from "type-graphql";

@InputType()
export class ChangePasswordInput {
  @Field()
  newPassword: string
}
