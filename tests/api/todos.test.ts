import { describe, expect, test } from "vitest";

import app from "../../src/app";

const BASE_PATH = "/v1/todos";
const INVALID_UUID = "3c7e7df8-be77-408a-9562-ebcd499d7a17";

describe.sequential("TODOs", () => {
  let todoId: string;
  test("GET `/todos` route initially", async () => {
    const res = await app.request(BASE_PATH);
    expect(res.status).toEqual(200);
    expect(await res.json()).toStrictEqual({ data: [] });
  });

  test("POST `/todos` route", async () => {
    const res = await app.request(BASE_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test Todo" }),
    });
    expect(res.status).toEqual(200);
    const result = await res.json();
    expect(result).toMatchObject({
      data: {
        // id: expect.any(String),
        title: "Test Todo",
        completed: false,
      },
    });
    todoId = result.data.id;
  });

  test("GET `/todos` route after POST", async () => {
    const res = await app.request(BASE_PATH);
    expect(res.status).toEqual(200);
    expect(await res.json()).toMatchObject({
      data: [
        {
          id: todoId,
          title: "Test Todo",
          completed: false,
        },
      ],
    });
  });

  test("GET `/todos/:id` route", async () => {
    const res = await app.request(`${BASE_PATH}/${todoId}`);
    expect(res.status).toEqual(200);
    expect(await res.json()).toMatchObject({
      data: {
        id: todoId,
        title: "Test Todo",
        completed: false,
      },
    });
  });

  test("GET `/todos/:id` route with invalid ID", async () => {
    const res = await app.request(`${BASE_PATH}/invalid-id`);
    expect(res.status).toEqual(400);
  });

  test("GET `/todos/:id` route with invalid UUID", async () => {
    const res = await app.request(`${BASE_PATH}/${INVALID_UUID}`);
    expect(res.status).toEqual(404);
    expect(await res.json()).toMatchObject({ error: "not found" });
  });

  test("PUT `/todos/:id` route", async () => {
    const res = await app.request(`${BASE_PATH}/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });
    expect(res.status).toEqual(200);
    expect(await res.json()).toMatchObject({
      data: {
        id: todoId,
        title: "Test Todo",
        completed: true,
      },
    });
  });

  test("PUT `/todos/:id` route with invalid ID", async () => {
    const res = await app.request(`${BASE_PATH}/invalid-id`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });
    expect(res.status).toEqual(400);
  });

  test("PUT `/todos/:id` route with invalid UUID", async () => {
    const res = await app.request(`${BASE_PATH}/${INVALID_UUID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });
    expect(res.status).toEqual(404);
    expect(await res.json()).toMatchObject({ error: "not found" });
  });

  test("DELETE `/todos/:id` route", async () => {
    const res = await app.request(`${BASE_PATH}/${todoId}`, {
      method: "DELETE",
    });
    expect(res.status).toEqual(200);
    expect(await res.json()).toMatchObject({ data: { id: todoId } });
  });

  test("DELETE `/todos/:id` route with invalid ID", async () => {
    const res = await app.request(`${BASE_PATH}/invalid-id`, {
      method: "DELETE",
    });
    expect(res.status).toEqual(400);
  });

  test("DELETE `/todos/:id` route with invalid UUID", async () => {
    const res = await app.request(`${BASE_PATH}/${INVALID_UUID}`, {
      method: "DELETE",
    });
    expect(res.status).toEqual(404);
    expect(await res.json()).toMatchObject({ error: "not found" });
  });

  test("GET `/todos` route after DELETE", async () => {
    const res = await app.request(BASE_PATH);
    expect(res.status).toEqual(200);
    expect(await res.json()).toMatchObject({ data: [] });
  });
});
