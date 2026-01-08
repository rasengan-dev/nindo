import { Link } from "rasengan"

export default function Sidebar() {
	return (
		<aside className="absolute top-0 w-[276px] h-full pl-6 pr-4 py-16 bg-background text-sm overflow-auto">
			<div className="flex flex-col text-foreground">
				<span className="text-foreground/60 font-medium px-2">Basic</span>
				<ul className="mt-2 flex flex-col gap-2 font-medium w-auto">
					<Link to="/docs">
						<li className="px-2 py-1 rounded-md hover:bg-muted/50 cursor-pointer">Getting started</li>
					</Link>
					<Link to="/docs/installation">
						<li className="px-2 py-1 rounded-md bg-muted w-auto cursor-pointer">Installation</li>
					</Link>
					<li className="px-2 py-1 rounded-md hover:bg-muted w-auto cursor-pointer">Quick Start</li>
				</ul>
			</div>

			<div className="flex flex-col text-foreground mt-10">
				<span className="text-foreground/60 font-medium px-2">Components</span>
				<ul className="mt-2 flex flex-col gap-2 font-medium w-auto">
					<li className="px-2 py-1 rounded-md hover:bg-muted/50 cursor-pointer">Markdown Editor</li>
					<li className="px-2 py-1 rounded-md hover:bg-muted w-auto cursor-pointer">Editor Core</li>
					<li className="px-2 py-1 rounded-md hover:bg-muted w-auto cursor-pointer">Editor Toolbar</li>
					<li className="px-2 py-1 rounded-md hover:bg-muted w-auto cursor-pointer">Editor Preview</li>
				</ul>
			</div>

			<div className="flex flex-col text-foreground mt-10">
				<span className="text-foreground/60 font-medium px-2">Hooks</span>
				<ul className="mt-2 flex flex-col gap-2 font-medium w-auto">
					<li className="px-2 py-1 rounded-md hover:bg-muted/50 cursor-pointer">useEditor</li>
					<li className="px-2 py-1 rounded-md hover:bg-muted w-auto cursor-pointer">useMarkdownShortcuts</li>
				</ul>
			</div>

			<div className="flex flex-col text-foreground mt-10">
				<span className="text-foreground/60 font-medium px-2">Customization</span>
				<ul className="mt-2 flex flex-col gap-2 font-medium w-auto">
					<li className="px-2 py-1 rounded-md hover:bg-muted/50 cursor-pointer">Custom Toolbar</li>
					<li className="px-2 py-1 rounded-md hover:bg-muted w-auto cursor-pointer">Custom Editor Core</li>
					<li className="px-2 py-1 rounded-md hover:bg-muted w-auto cursor-pointer">Custom Editor Preview</li>
					<li className="px-2 py-1 rounded-md hover:bg-muted w-auto cursor-pointer">Custom Shortcuts</li>
				</ul>
			</div>
		</aside>
	)
}