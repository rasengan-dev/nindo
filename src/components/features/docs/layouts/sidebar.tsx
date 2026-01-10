import { Link, NavLink } from "rasengan"

export default function Sidebar() {
	return (
		<aside className="absolute top-0 w-[276px] h-full pl-6 pr-4 py-16 bg-background text-sm overflow-auto">
			<div className="flex flex-col text-foreground">
				<span className="text-foreground/60 font-medium px-2">Basic</span>
				<ul className="mt-2 flex flex-col gap-1 font-medium w-auto">
					<NavLink end to="/docs" className={({ isActive}) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">Getting started</li>
					</NavLink>
					<NavLink to="/docs/installation" className={({ isActive}) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">Installation</li>
					</NavLink>
					<NavLink to="/docs/quick-start" className={({ isActive}) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">Quick Start</li>
					</NavLink>
				</ul>
			</div>

			<div className="flex flex-col text-foreground mt-10">
				<span className="text-foreground/60 font-medium px-2">Components</span>
				<ul className="mt-2 flex flex-col gap-1 font-medium w-auto">
					<NavLink to="/docs/components/markdown-editor" className={({ isActive}) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">Markdown Editor</li>
					</NavLink>
					<NavLink end to="/docs/components/editor-core" className={({ isActive}) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">Editor Core</li>
					</NavLink>
					<NavLink end to="/docs/components/editor-preview" className={({ isActive}) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">Editor Preview</li>
					</NavLink>
					<NavLink to="/docs/components/editor-toolbar" className={({ isActive}) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">Editor Toolbar</li>
					</NavLink>
				</ul>
			</div>

			<div className="flex flex-col text-foreground mt-10">
				<span className="text-foreground/60 font-medium px-2">Hooks</span>
				<ul className="mt-2 flex flex-col gap-1 font-medium w-auto">
					<NavLink to="/docs/hooks/use-editor" className={({ isActive}) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">useEditor</li>
					</NavLink>
					<NavLink to="/docs/hooks/use-markdown-shortcuts" className={({ isActive}) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">useMarkdownShortcuts</li>
					</NavLink>
				</ul>
			</div>

			<div className="flex flex-col text-foreground mt-10">
				<span className="text-foreground/60 font-medium px-2">Customization</span>
				<ul className="mt-2 flex flex-col gap-1 font-medium w-auto">
					<NavLink to="/docs/customization/custom-toolbar" className={({ isActive}) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">Custom Toolbar</li>
					</NavLink>
					<NavLink to="/docs/customization/custom-editor-core" className={({ isActive }) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">Custom Editor Core</li>
					</NavLink>
					<NavLink to="/docs/customization/custom-editor-preview" className={({ isActive }) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">Custom Editor Preview</li>
					</NavLink>
					<NavLink to="/docs/customization/custom-shortcuts" className={({ isActive }) => isActive ? "bg-muted rounded-md" : ""}>
						<li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">Custom Shortcuts</li>
					</NavLink>
				</ul>
			</div>
		</aside>
	)
}