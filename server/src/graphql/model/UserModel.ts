import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id!: string;

  @Field(() => Date)
  create_at!: Date;

  @Field(() => Date)
  update_at!: Date;

  @Field()
  email!: string;

  @Field()
  username!: string;
}