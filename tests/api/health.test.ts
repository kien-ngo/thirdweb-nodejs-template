import { describe, expect, test } from "vitest";

import app from "../../src/app";

describe("Service Health", () => {
  test("GET `/health` route", async () => {
    const res = await app.request("/health");
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({
      status: "ok",
      redis: "ok",
      correlationId: expect.any(String),
    });
  });
});
