// mdx-components.jsx
import { defineMDXConfig, CodeBlock, useActiveTocItem } from "@rasenganjs/mdx";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var mdx_components_default = defineMDXConfig({
  components: {
    p: ({ children, ...props }) => /* @__PURE__ */ jsx("p", { ...props, className: "text-sm font-medium leading-relaxed [&:not(:first-child)]:mt-6 text-foreground/90", children }),
    a: ({ children, ...props }) => /* @__PURE__ */ jsx("a", { ...props, className: "text-primary font-semibold underline underline-offset-4 cursor-pointer", children }),
    h1: ({ children, ...props }) => /* @__PURE__ */ jsx("h1", { ...props, className: "sm:text-3xl text-4xl font-semibold mt-4 mb-5 text-foreground", children }),
    h2: ({ children, ...props }) => /* @__PURE__ */ jsx("h2", { ...props, className: "text-xl font-semibold mt-8 mb-3 text-foreground", children }),
    h3: ({ children, ...props }) => /* @__PURE__ */ jsx("h3", { ...props, className: "text-lg font-semibold mt-8 mb-3 text-foreground", children }),
    h4: ({ children, ...props }) => /* @__PURE__ */ jsx("h4", { ...props, className: "text-md font-medium mt-8 mb-3 text-foreground", children }),
    h5: ({ children, ...props }) => /* @__PURE__ */ jsx("h5", { ...props, className: "text-md font-medium mt-8 mb-3 text-foreground", children }),
    h6: ({ children, ...props }) => /* @__PURE__ */ jsx("h6", { ...props, className: "text-md font-medium mt-8 mb-3 text-foreground", children }),
    ol: ({ children, ...props }) => /* @__PURE__ */ jsx("ol", { ...props, className: "my-6 ml-6 list-decimal", children }),
    ul: ({ children, ...props }) => /* @__PURE__ */ jsx("ul", { ...props, className: "my-6 ml-6 list-decimal list-inside", children }),
    li: ({ children, ...props }) => /* @__PURE__ */ jsx("li", { ...props, className: "mt-2 text-sm font-medium text-foreground/90", children }),
    code: ({ children, ...rest }) => {
      if (rest["data-language"]) {
        return /* @__PURE__ */ jsx(CodeBlock, { children, ...rest, className: "bg-input/5 border-border" });
      }
      return /* @__PURE__ */ jsx("code", { ...rest, className: "bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.9rem] break-words outline-none", children });
    }
  },
  toc: (toc) => {
    const [activeId] = useActiveTocItem(toc, {
      threshold: 0.5,
      rootMargin: "0px 0px -80% 0px"
    });
    return /* @__PURE__ */ jsx("div", { className: "sticky top-4 max-h-[calc(100vh-10rem)] overflow-y-auto flex flex-col gap-8", children: /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold mt-0 mb-2 text-foreground/50", children: "On This Page" }),
      /* @__PURE__ */ jsx("ul", { className: "list-inside text-sm font-medium text-foreground/10", children: toc.map((item, index) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("li", { className: "py-1", children: /* @__PURE__ */ jsx(
          "a",
          {
            href: `#${item.anchor.id}`,
            className: activeId === item.anchor.id ? "text-primary underline underline-offset-4 text-foreground" : "cursor-pointer text-primary hover:underline",
            children: item.anchor.text
          }
        ) }, index),
        item.children && item.children.length > 0 && /* @__PURE__ */ jsx("ul", { className: "list-inside ml-4", children: item.children.map((child) => /* @__PURE__ */ jsx("li", { className: "py-1", children: /* @__PURE__ */ jsx(
          "a",
          {
            href: `#${child.anchor.id}`,
            className: activeId === child.anchor.id ? "text-primary underline underline-offset-4 text-foreground" : "cursor-pointer text-primary hover:underline",
            children: child.anchor.text
          }
        ) }, child.anchor.id)) })
      ] })) })
    ] }) });
  }
});
export {
  mdx_components_default as default
};
