import { NavLink } from "rasengan"

// Navigation data structure
const navigation = [
  {
    title: "Basic",
    items: [
      { label: "Getting started", to: "/docs" },
      { label: "Installation", to: "/docs/installation" },
      { label: "Quick Start", to: "/docs/quick-start" }
    ]
  },
  {
    title: "Components",
    items: [
      { label: "Markdown Editor", to: "/docs/components/markdown-editor" },
      { label: "Editor Core", to: "/docs/components/editor-core" },
      { label: "Editor Preview", to: "/docs/components/editor-preview" },
      { label: "Editor Toolbar", to: "/docs/components/editor-toolbar" }
    ]
  },
  {
    title: "Hooks",
    items: [
      { label: "useEditor", to: "/docs/hooks/use-editor" },
      { label: "useEditorShortcuts", to: "/docs/hooks/use-editor-shortcuts" }
    ]
  },
  {
    title: "Customization",
    items: [
      { label: "Custom Editor", to: "/docs/customization/custom-editor" },
    ]
  }
];

export default function Sidebar({ onClose = () => {} }: { onClose?: () => void }) {
  return (
    <aside className="absolute top-0 w-[276px] h-full pl-6 pr-4 py-16 bg-background text-sm overflow-auto">
      {navigation.map((section, index) => (
        <div key={section.title} className={`flex flex-col text-foreground ${index > 0 ? 'mt-10' : ''}`}>
          <span className="text-foreground/60 font-medium px-2">{section.title}</span>
          <ul className="mt-2 flex flex-col gap-1 font-medium w-auto">
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                end={item.to === '/docs'}
                to={item.to}
                className={({ isActive }) => isActive ? "bg-muted rounded-md" : ""}
                onClick={onClose}
              >
                <li className="px-2 py-1 hover:bg-muted/50 cursor-pointer">
                  {item.label}
                </li>
              </NavLink>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  )
}