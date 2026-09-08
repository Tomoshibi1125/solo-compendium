import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDiceTray } from "@/components/dice/DiceTrayContext";

/**
 * Compatibility endpoint for old bookmarks and links. The full-page roller is
 * intentionally gone; visiting `/dice` opens the global manual tray and then
 * returns the user to the normal app surface.
 */
export function DiceTrayRoute() {
	const { openManual } = useDiceTray();
	const navigate = useNavigate();
	const openedRef = useRef(false);

	useEffect(() => {
		if (openedRef.current) return;
		openedRef.current = true;
		openManual();
		navigate("/landing", { replace: true });
	}, [navigate, openManual]);

	return null;
}
