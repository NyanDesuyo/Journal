import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class AuthModel {
  @Field(() => String)
  message!: string;

  @Field(() => String, { nullable: true })
  info?: any | null | undefined;

  @Field(() => String, { nullable: true })
  accessToken?: string | null | undefined;

  @Field(() => String, { nullable: true })
  refreshToken?: string | null | undefined;
}
