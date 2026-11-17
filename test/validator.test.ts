import { describe, expect, it } from "vitest";
import { validateSubmission } from "../src/validator.ts";
import { Priority } from "../src/types.ts";

describe("validateSubmission", () => {
  it("allows complete request submissions", () => {
    expect(
      validateSubmission({
        title: "foo",
        requester: "foo@example.com",
        priority: "normal",
      }),
    ).toBe(true);
  });

  it("allows request submissions without priority", () => {
    expect(
      validateSubmission({
        title: "foo",
        requester: "foo@example.com",
      }),
    ).toBe(true);
  });

  it("does not allow submissions with invalid priority", () => {
    expect(
      validateSubmission({
        title: "foo",
        requester: "foo@example.com",
        priority: "foo" as unknown as Priority,
      }),
    ).toBe(false);
  });
});
