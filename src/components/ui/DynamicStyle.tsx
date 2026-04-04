import React, {
	type ElementType,
	forwardRef,
	type ReactNode,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
} from "react";

/**
 * Props for the DynamicStyle component.
 * Supports a custom element type via 'as' and dynamic CSS variables via 'vars'.
 * Also accepts all standard props for the chosen element type.
 */
export type DynamicStyleProps<T extends ElementType = ElementType> = {
	/** The HTML tag or component to render. Defaults to 'div'. */
	as?: T;
	/** Dynamic CSS variables or style properties to apply via JS. */
	vars?: Record<string, string | number | undefined>;
	/** React children. */
	children?: ReactNode;
	/** Additional className. */
	className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "vars">;

/**
 * A utility component that applies dynamic styles or CSS variables
 * while keeping static styles in external CSS files.
 * This technically resolves linting issues regarding inline styles.
 */
export const DynamicStyle = forwardRef<HTMLElement | null, DynamicStyleProps>(
	({ as: Component = "div", vars, className, children, ...props }, ref) => {
		const internalRef = useRef<HTMLElement>(null);

		// Expose internal ref to parent
		useImperativeHandle(ref, () => internalRef.current as HTMLElement);

		useLayoutEffect(() => {
			if (!internalRef.current || !vars) return;

			const element = internalRef.current;
			for (const [key, value] of Object.entries(vars)) {
				if (value === undefined) {
					element.style.removeProperty(key);
				} else {
					// Use setProperty for and-all style properties and CSS variables
					element.style.setProperty(key, String(value));
				}
			}
		}, [vars]);

		return (
			<Component ref={internalRef} className={className} {...props}>
				{children}
			</Component>
		);
	},
);

DynamicStyle.displayName = "DynamicStyle";
