import { describe, it } from "vitest";
import { assertRegentLock } from "./assertRegentLock";
import { REGENT_EXPECTATIONS } from "./regentExpectations";

describe("Umbral Regent canon lock", () => {
	it("matches canonical requirements, features, progression, and grants", () => {
		assertRegentLock(REGENT_EXPECTATIONS.umbral_regent);
	});
});
