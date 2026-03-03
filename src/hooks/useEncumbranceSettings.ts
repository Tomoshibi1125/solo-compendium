import { useEffect, useState } from "react";

const STORAGE_KEY_PREFIX = "solo-compendium.settings.encumbrance.";

export function useEncumbranceSettings(characterId: string) {
	const [ignoreCurrencyWeight, setIgnoreCurrencyWeight] =
		useState<boolean>(false);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			const stored = window.localStorage.getItem(
				`${STORAGE_KEY_PREFIX}${characterId}`,
			);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (typeof parsed.ignoreCurrencyWeight === "boolean") {
					setIgnoreCurrencyWeight(parsed.ignoreCurrencyWeight);
				}
			}
		} catch {
			// ignore
		} finally {
			setIsLoaded(true);
		}
	}, [characterId]);

	const updateIgnoreCurrencyWeight = (value: boolean) => {
		setIgnoreCurrencyWeight(value);
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(
				`${STORAGE_KEY_PREFIX}${characterId}`,
				JSON.stringify({ ignoreCurrencyWeight: value }),
			);
		} catch {
			// ignore
		}
	};

	return {
		ignoreCurrencyWeight,
		setIgnoreCurrencyWeight: updateIgnoreCurrencyWeight,
		isLoaded,
	};
}
