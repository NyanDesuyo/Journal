import { Field, ID, ObjectType } from "type-graphql";
import { JSONResolver } from "graphql-scalars";
@ObjectType()
export class PostItModel {
  @Field(() => ID)
  id!: string;

  @Field(() => Date)
  create_at!: Date;

  @Field(() => Date)
  update_at!: Date;

  @Field()
  head!: string;

  @Field(() => String, { nullable: true })
  body?: string | null;

  @Field(() => Boolean)
  status!: boolean;
}

@ObjectType()
export class ResponsePostIt {
  @Field()
  message!: string;

  @Field(() => [PostItModel])
  data?: PostItModel[] | null;

  @Field(() => PostItModel, { nullable: true })
  result?: PostItModel | null;

  @Field(() => JSONResolver, { nullable: true })
  info?: any | null;
}
