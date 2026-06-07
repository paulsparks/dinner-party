import { createSchemaFactory } from "@zenstackhq/zod";
import { schema } from "~/zenstack/schema";

export const schemaFactory = createSchemaFactory(schema);
