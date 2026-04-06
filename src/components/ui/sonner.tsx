import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "rift" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-black/85 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-primary/40 group-[.toaster]:shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_15px_hsl(var(--primary)/0.15)] group-[.toaster]:rounded-[2px]",
					description: "group-[.toast]:text-muted-foreground font-heading",
					actionButton:
						"group-[.toast]:bg-primary/20 group-[.toast]:border group-[.toast]:border-primary/50 group-[.toast]:text-primary-foreground group-[.toast]:rounded-[2px]",
					cancelButton:
						"group-[.toast]:bg-black/50 group-[.toast]:border group-[.toast]:border-muted/30 group-[.toast]:text-muted-foreground group-[.toast]:rounded-[2px]",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster, toast };
