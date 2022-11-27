import { buildSchemaSync } from "type-graphql";
import { AuthResolver, PostItResolver } from "./resolver";

const graphqlSchema = buildSchemaSync({
  resolvers: [AuthResolver,PostItResolver],
  validate: false,
});

export default graphqlSchema;
