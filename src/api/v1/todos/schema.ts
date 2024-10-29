import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { todo } from "../../../db/schema.js";

// creates a schema for inserting a todo based on the todo table
export const TodoInsertSchema = createInsertSchema(todo, {
  // example of how to add extra validation to the schema
  title: (schema) => schema.title.min(3, "Title must be at least 3 characters"),
})
  // for inserts we only care about the title and completed fields
  .pick({ title: true, completed: true });

// creates a schema for selecting a todo based on the todo table
export const TodoSelectSchema = createSelectSchema(todo)
  // for selects we only care about the id, title, and completed fields
  .pick({
    id: true,
    title: true,
    completed: true,
  });

export const TodoPaginationSchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .default(10)
    .openapi({ example: 10, description: "The number of items to return" }),
  offset: z.coerce.number().int().min(0).default(0).openapi({ example: 0 }),
});
