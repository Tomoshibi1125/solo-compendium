import { describe, it } from "vitest";
import { assertRegentLock } from "./assertRegentLock";
import { REGENT_EXPECTATIONS } from "./regentExpectations";

describe("Plague Regent canon lock", () => {
	it("matches canonical requirements, features, progression, and grants", () => {
		assertRegentLock(REGENT_EXPECTATIONS.plague_regent);
	});
});
