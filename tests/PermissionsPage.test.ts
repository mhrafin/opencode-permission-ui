import { describe, expect, it } from "vitest";
import { createProjectTitle } from "../src/pages/PermissionsPage.tsx";

describe("createProjectTitle", () => {
  it("returns the final segment of a canonical project path", () => {
    expect(createProjectTitle("/home/user/projects/opencode")).toBe(
      "/opencode",
    );
  });

  it("returns a single-segment canonical path unchanged", () => {
    expect(createProjectTitle("opencode")).toBe("opencode");
  });
});
