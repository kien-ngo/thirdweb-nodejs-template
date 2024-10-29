import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../db/connection.js";
import { todo } from "../../../db/schema.js";
import {
  TodoInsertSchema,
  TodoPaginationSchema,
  TodoSelectSchema,
} from "./schema.js";

const todos = new OpenAPIHono();

const get = createRoute({
  method: "get",
  path: "/",
  request: {
    query: TodoPaginationSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(TodoSelectSchema),
          }),
        },
      },
      description: "Success",
    },
  },
});

todos.openapi(get, async (c) => {
  // get the limit and offset from the request (defaulted to 10 and 0 in the schema)
  const { limit, offset } = c.req.valid("query");

  // get all todos from the database
  // Note: this could be optimized into a prepared statement
  const records = await db
    .select()
    .from(todo)
    .where(isNull(todo.deletedAt))
    .orderBy(desc(todo.updatedAt))
    .limit(limit)
    .offset(offset);

  // convert the todos to a public representation
  const publicTodos = records.map((r) => TodoSelectSchema.parse(r));

  // return the public todos
  return c.json({ data: publicTodos });
});

const getSingle = createRoute({
  method: "get",
  path: "/:id",
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            data: TodoSelectSchema,
          }),
        },
      },
      description: "Success",
    },
    404: {
      description: "Not found",
    },
  },
});

todos.openapi(getSingle, async (c) => {
  // get the todo ID from the request
  const id = c.req.valid("param").id;

  // get the todo from the database
  // Note: this could be optimized into a prepared statement
  const [record] = await db
    .select()
    .from(todo)
    .where(and(eq(todo.id, id), isNull(todo.deletedAt)))
    .limit(1);

  // if there is no todo with that ID, return a 404
  if (!record) {
    return c.json({ error: "not found" }, 404);
  }

  // convert the todo to a public representation
  const publicTodo = TodoSelectSchema.parse(record);

  // return the public todo
  return c.json({ data: publicTodo });
});

const post = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: TodoInsertSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            data: TodoSelectSchema,
          }),
        },
      },
      description: "Success",
    },
    400: {
      description: "Bad request",
    },
  },
});

todos.openapi(post, async (c) => {
  // get the valid todo from the request
  const validatedTodo = c.req.valid("json");

  // insert the todo into the database
  const [newTodo] = await db.insert(todo).values(validatedTodo).returning();

  // convert the todo to a public representation
  const publicTodo = TodoSelectSchema.parse(newTodo);

  // return the public todo
  return c.json({ data: publicTodo });
});

const put = createRoute({
  method: "put",
  path: "/:id",
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        "application/json": {
          schema: TodoInsertSchema.partial(),
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            data: TodoInsertSchema.partial(),
          }),
        },
      },
      description: "Success",
    },
    400: {
      description: "Bad request",
    },
    404: {
      description: "Not found",
    },
  },
});

todos.openapi(put, async (c) => {
  // get the todo ID from the request
  const id = c.req.param("id");

  // get the valid todo from the request (it's partial, since we only need the fields to update)
  const validatedTodo = c.req.valid("json");

  // update the todo in the database
  const [updatedTodo] = await db
    .update(todo)
    .set(validatedTodo)
    .where(and(eq(todo.id, id), isNull(todo.deletedAt)))
    .returning();

  // if there is no todo with that ID, return a 404
  if (!updatedTodo) {
    return c.json({ error: "not found" }, 404);
  }

  // convert the todo to a public representation
  const publicTodo = TodoSelectSchema.parse(updatedTodo);

  // return the public todo
  return c.json({ data: publicTodo });
});

const deleteTodo = createRoute({
  method: "delete",
  path: "/:id",
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            data: TodoSelectSchema,
          }),
        },
      },
      description: "Success",
    },
    404: {
      description: "Not found",
    },
  },
});

todos.openapi(deleteTodo, async (c) => {
  // get the todo ID from the request
  const id = c.req.param("id");

  // SOFT-delete the todo from the database
  const [deletedTodo] = await db
    .update(todo)
    .set({ deletedAt: new Date() })
    .where(and(eq(todo.id, id), isNull(todo.deletedAt)))
    .returning();

  // if there is no todo with that ID, return a 404
  if (!deletedTodo) {
    return c.json({ error: "not found" }, 404);
  }

  // convert the todo to a public representation
  const publicTodo = TodoSelectSchema.parse(deletedTodo);

  // return the public todo
  return c.json({ data: publicTodo });
});

export default todos;
