import { defineMDXConfig, CodeBlock, useActiveTocItem } from "@rasenganjs/mdx";

export default defineMDXConfig({
	components: {
		p: ({ children, ...props }) => <p {...props} className="text-sm font-medium leading-relaxed [&:not(:first-child)]:mt-6 text-foreground/90">{children}</p>,
		a: ({ children, ...props }) => <a {...props} className="text-primary font-semibold underline underline-offset-4 cursor-pointer">{children}</a>,
		h1: ({ children, ...props }) => <h1 {...props} className="sm:text-3xl text-4xl font-semibold mt-4 mb-5 text-foreground">{children}</h1>,
		h2: ({ children, ...props }) => <h2 {...props} className="text-xl font-semibold mt-8 mb-3 text-foreground">{children}</h2>,
		h3: ({ children, ...props }) => <h3 {...props} className="text-lg font-semibold mt-8 mb-3 text-foreground">{children}</h3>,
		h4: ({ children, ...props }) => <h4 {...props} className="text-md font-medium mt-8 mb-3 text-foreground">{children}</h4>,
		h5: ({ children, ...props }) => <h5 {...props} className="text-md font-medium mt-8 mb-3 text-foreground">{children}</h5>,
		h6: ({ children, ...props }) => <h6 {...props} className="text-md font-medium mt-8 mb-3 text-foreground">{children}</h6>,
		ol: ({ children, ...props }) => <ol {...props} className="my-6 ml-6 list-decimal">{children}</ol>,
		ul: ({ children, ...props }) => <ul {...props} className="my-6 ml-6 list-decimal list-inside">{children}</ul>,
		li: ({ children, ...props }) => <li {...props} className="mt-2 text-sm font-medium text-foreground/90">{children}</li>,
		code: ({ children, ...rest }) => {
			if (rest["data-language"]) {
				return <CodeBlock children={children} {...rest} className="bg-input/5 border-border" />
			}

			return <code {...rest} className="bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.9rem] break-words outline-none">{children}</code>
		}
	},

	toc: (toc) => {
    const [activeId] = useActiveTocItem(toc, {
      threshold: 0.5,
			rootMargin: "0px 0px -80% 0px"
    });

    return (
      <div className="sticky top-4 max-h-[calc(100vh-10rem)] overflow-y-auto flex flex-col gap-8">
        <div className="mt-8">
          <h2 className="text-sm font-semibold mt-0 mb-2 text-foreground/50">
            On This Page
          </h2>
          <ul className="list-inside text-sm font-medium text-foreground/10">
            {toc.map((item, index) => (
              <>
                <li key={index} className="py-1">
                  <a
                    href={`#${item.anchor.id}`}
                    className={
                      activeId === item.anchor.id
                        ? 'text-primary underline underline-offset-4 text-foreground'
                        : 'cursor-pointer text-primary hover:underline'
                    }
                  >
                    {item.anchor.text}
                  </a>
                </li>
                {item.children && item.children.length > 0 && (
                  <ul className="list-inside ml-4">
                    {item.children.map((child) => (
                      <li key={child.anchor.id} className="py-1">
                        <a
                          href={`#${child.anchor.id}`}
                          className={
                            activeId === child.anchor.id
                              ? 'text-primary underline underline-offset-4 text-foreground'
                              : 'cursor-pointer text-primary hover:underline'
                          }
                        >
                          {child.anchor.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ))}
          </ul>
        </div>
      </div>
    );
  },
});