import { Field, InputType } from "type-graphql";

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

@InputType()
export class DateOrder {
  @Field(() => SortOrder)
  create_at!: SortOrder;

  @Field(() => SortOrder)
  update_at!: SortOrder;
}
