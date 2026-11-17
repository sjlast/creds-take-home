import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.ts";
import { createLogNotifier } from "../src/notifier.ts";
import { createStore } from "../src/store.ts";

function makeApp() {
  return buildApp({
    store: createStore(),
    notifier: createLogNotifier({ log: () => undefined }),
  });
}

describe("GET /health", () => {
  it("answers 200", async () => {
    const response = await makeApp().inject({ method: "GET", url: "/health" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });
});

describe("GET /requests", () => {
  it("lists the sample requests", async () => {
    const response = await makeApp().inject({
      method: "GET",
      url: "/requests",
    });
    expect(response.statusCode).toBe(200);
    const body = response.json<{ id: number; title: string }[]>();
    expect(body.map((request) => request.id)).toEqual([0, 1, 2]);
    expect(body[1]?.title).toBe("Laptop will not charge");
  });
});

describe("GET /requests/:id", () => {
  it("returns the indicated request", async () => {
    const response = await makeApp().inject({
      method: "GET",
      url: "/requests/0",
    });
    expect(response.statusCode).toBe(200);
    const body = response.json<{ id: number; title: string }>();
    expect(body.id).toEqual(0);
    expect(body.title).toBe("Reset my VPN token");
  });

  it("returns failure message when ID not found", async () => {
    const response = await makeApp().inject({
      method: "GET",
      url: "/requests/100",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("No support request found with that ID.");
  });
});

describe("POST /requests", () => {
  it("returns the created request", async () => {
    const response = await makeApp().inject({
      method: "POST",
      url: "/requests",
      body: { title: "foo", priority: "low", requester: "bar" },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json<{
      supportNotified: boolean;
      request: { id: number; title: string };
    }>();
    expect(body.request.id).toEqual(3);
    expect(body.request.title).toBe("foo");
  });

  it("returns error code when submission missing data", async () => {
    const response = await makeApp().inject({
      method: "POST",
      url: "/requests",
      body: { priority: "low", requester: "bar" },
    });
    expect(response.statusCode).toBe(500);
  });
});
