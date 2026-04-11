import ReactMarkdown from "react-markdown";
import { RiftHeading } from "@/components/ui/AscendantText";
import { massiveSandboxModule } from "@/data/compendium/ascendant-sandbox-module";

export const SandboxModuleChapter = () => {
	const chapters = massiveSandboxModule.chapters;

	return (
		<div className="max-w-4xl mx-auto space-y-16 pb-16">
			{/* Campaign Module Header */}
			<div className="space-y-6 text-center border-b border-fuchsia-500/20 pb-12 mb-12">
				<RiftHeading
					level={1}
					variant="sovereign"
					dimensional
					className="text-5xl lg:text-6xl text-fuchsia-500"
				>
					{massiveSandboxModule.title}
				</RiftHeading>
				<p className="text-xl font-serif text-slate-400 max-w-2xl mx-auto leading-relaxed">
					{massiveSandboxModule.description ||
						"A massive sandbox campaign module built for solo and group play."}
				</p>
			</div>

			{/* Chapter Content */}
			{chapters.map((chapter) => (
				<section
					key={chapter.title}
					className="space-y-6 scroll-mt-24"
					id={chapter.title.replace(/\s+/g, '-').toLowerCase()}
				>
					<div className="flex items-center justify-between border-b border-fuchsia-500/10 pb-4">
						<h2 className="text-4xl font-display text-white uppercase tracking-wider">
							{chapter.title}
						</h2>
					</div>
					<div
						className="prose prose-invert prose-emerald max-w-none 
                                prose-headings:font-display prose-headings:text-primary 
                                prose-a:text-accent prose-a:no-underline font-serif text-lg leading-loose"
					>
						<ReactMarkdown
							components={{
								a: ({ node, href, children, ...props }) => {
									// In static mode we just un-link wiki references or present them as bold italics
									if (href?.startsWith("wiki://")) {
										return (
											<span className="text-primary italic font-bold">
												{children}
											</span>
										);
									}
									return (
										<a
											href={href}
											target="_blank"
											rel="noreferrer"
											className="text-secondary hover:underline"
											{...props}
										>
											{children}
										</a>
									);
								},
							}}
						>
							{chapter.content.replace(/\[\[(.*?)\]\]/g, "[$1](wiki://$1)")}
						</ReactMarkdown>
					</div>
				</section>
			))}
		</div>
	);
};
