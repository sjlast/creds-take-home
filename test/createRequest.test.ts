import { describe, expect, it } from "vitest";
import { createSupportRequest } from "../src/createRequest.ts";

describe("createSupportRequest", () => {
  it("creates a valid SupportRequest", () => {
    const actual = createSupportRequest({
      title: "foo",
      requester: "bar",
      priority: "low",
    });
    expect(actual).toMatchObject({
      title: "foo",
      requester: "bar",
      priority: "low",
    });
    expect(actual.id).toBeGreaterThanOrEqual(0);
    expect(actual.createdAt).toBeTruthy();
  });

  it("creates a SupportRequest with normal priority when not specified", () => {
    const actual = createSupportRequest({ title: "foo", requester: "bar" });
    expect(actual).toMatchObject({
      title: "foo",
      requester: "bar",
      priority: "normal",
    });
    expect(actual.id).toBeGreaterThanOrEqual(0);
    expect(actual.createdAt).toBeTruthy();
  });
});
