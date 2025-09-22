// MarkdownMessage.tsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import "highlight.js/styles/github-dark.css"; // choose your theme
import "katex/dist/katex.min.css";

interface Props {
  content: string;
  isUser?: boolean;
}

const mathSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: [
      ...(defaultSchema.attributes?.span || []),
      ["className"], // allow katex classes
    ],
  },
};

interface ReactTransitionalElement {
  $$typeof: symbol;
  key: string;
  props: {
    children: string;
    className: string;
    key?: string | number;
  };
  type: string;
  _owner: FiberNode;
  _store: {
    validated: number;
  };
  ref: null;
  _debugInfo: null;
  _debugStack: Error;
}

interface FiberNode {
  tag: number;
  key: null | string | number;
  stateNode: null | any;
  elementType: Function;
  type: Function;
  // Add other properties as needed
}

/** Recursively extract text from React children / AST nodes */
const extractText = (node: any): string => {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node))
    return extractText(
      (node.props && (node as ReactTransitionalElement).props.children) ?? ""
    );
  if (typeof node === "object") {
    if (typeof node.value === "string") return node.value;
    if (node.children) return extractText(node.children);
  }
  return "";
};

const MarkdownMessage: React.FC<Props> = ({ content, isUser }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div
      className={`${
        isUser
          ? "bg-[#131313] text-white max-w-[75%] px-4 py-2 rounded-2xl rounded-tr-none shadow-md"
          : "rounded-2xl px-4 py-3 shadow-sm max-w-[100%] whitespace-pre-wrap"
      }`}
    >
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]} // tables, strikethrough, task lists, math
          rehypePlugins={[
            rehypeKatex,

            rehypeHighlight,
            [rehypeSanitize, mathSchema],
          ]} // math rendering + syntax highlight
          components={{
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-3">
                <table
                  className="min-w-full border border-gray-300 text-left text-sm"
                  {...props}
                />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th
                className="border border-gray-300 px-3 py-1 font-semibold"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td className="border border-gray-300 px-3 py-1" {...props} />
            ),
            code: (props: any) => {
              const { className, children } = props;
              const isInlineFromNode =
                props.node?.tagName === "code" &&
                !props.node?.position?.start?.line;
              const raw = extractText(props.children);
              const isInline =
                typeof props.inline === "boolean"
                  ? props.inline
                  : isInlineFromNode || !raw.includes("\n");

              if (isInline) {
                // inline code: render as inline element (won't take full width)
                return (
                  <code
                    className="bg-gray-200 dark:bg-gray-800 py-1 px-2 rounded text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <div className="relative group">
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(raw)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-xs px-2 py-1 rounded cursor-pointer"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownMessage;

// // MarkdownMessage.tsx
// import React, { useState } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";
// import rehypeHighlight from "rehype-highlight";
// import rehypeSanitize from "rehype-sanitize";
// import "highlight.js/styles/github-dark.css"; // choose your theme
// import "katex/dist/katex.min.css";
// import "highlight.js/styles/github.css";

// interface Props {
//   content: string;
//   isUser?: boolean;
// }

// function preprocessMath(content: string): string {
//   // Split content into code and non-code parts
//   const codeBlockRegex = /```[\s\S]*?```|`[^`]*`/g;

//   let lastIndex = 0;
//   let result = "";

//   const matches = content.matchAll(codeBlockRegex);

//   for (const match of matches) {
//     const [code] = match;
//     const start = match.index ?? 0;

//     // Process non-code section for math
//     const nonCodePart = content
//       .slice(lastIndex, start)
//       .replace(/(\\[a-zA-Z]+[\w{}^_\\]*)/g, (m) =>
//         m.startsWith("$") || m.endsWith("$") ? m : `$${m}$`
//       );

//     result += nonCodePart + code; // Keep code untouched
//     lastIndex = start + code.length;
//   }

//   // Process the remainder after the last code block
//   result += content
//     .slice(lastIndex)
//     .replace(/(\\[a-zA-Z]+[\w{}^_\\]*)/g, (m) =>
//       m.startsWith("$") || m.endsWith("$") ? m : `$${m}$`
//     );

//   return result;
// }

// /** Recursively extract text from React children / AST nodes */
// const extractText = (node: any): string => {
//   if (node == null) return "";
//   if (typeof node === "string" || typeof node === "number") return String(node);
//   if (Array.isArray(node)) return node.map(extractText).join("");
//   if (React.isValidElement(node))
//     return extractText((node.props && node.props.children) ?? "");
//   if (typeof node === "object") {
//     // Some AST nodes have a .value or .children
//     if (typeof node.value === "string") return node.value;
//     if (node.children) return extractText(node.children);
//   }
//   return "";
// };

// const MarkdownMessage: React.FC<Props> = ({ content, isUser }) => {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1400);
//     } catch (err) {
//       console.error("Copy failed", err);
//     }
//   };

//   const processedContent = preprocessMath(content);

//   return (
//     <div
//       className={`${
//         isUser
//           ? "bg-[#131313] text-white max-w-[75%] px-4 py-2 rounded-2xl rounded-tr-none shadow-md"
//           : "rounded-2xl px-4 py-3 shadow-sm max-w-[85%] whitespace-pre-wrap"
//       }
//       `}
//     >
//       <div className="prose prose-sm dark:prose-invert max-w-none">
//         <ReactMarkdown
//           remarkPlugins={[remarkGfm, remarkMath]} // enables tables, task lists, strikethrough
//           rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeSanitize]} // highlight + sanitize
//           components={{
//             table: ({ node, ...props }) => (
//               <div className="overflow-x-auto my-3">
//                 <table
//                   className="min-w-full border border-gray-300 text-left text-sm"
//                   {...props}
//                 />
//               </div>
//             ),
//             th: ({ node, ...props }) => (
//               <th
//                 className="border border-gray-300 px-3 py-1 font-semibold"
//                 {...props}
//               />
//             ),
//             td: ({ node, ...props }) => (
//               <td className="border border-gray-300 px-3 py-1" {...props} />
//             ),
//             code: ({ node, inline, className, children, ...props }) => {
//               if (inline) {
//                 return (
//                   <code
//                     className="bg-gray-200 dark:bg-gray-800 px-1 rounded text-sm"
//                     {...props}
//                   >
//                     {children}
//                   </code>
//                 );
//               }

//               // Safely extract raw code text for "copy"
//               const raw = extractText(children).replace(/\n$/, "");

//               return (
//                 <div className="relative group">
//                   <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
//                     {/* Render the highlighted children as-is (rehype-highlight produces spans) */}
//                     <code className={className} {...props}>
//                       {children}
//                     </code>
//                   </pre>

//                   {/* Copy button appears on hover (group-hover) */}
//                   <button
//                     onClick={() => handleCopy(raw)}
//                     className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-xs px-2 py-1 rounded"
//                   >
//                     {copied ? "Copied!" : "Copy"}
//                   </button>
//                 </div>
//               );
//             },
//           }}
//         >
//           {processedContent}
//         </ReactMarkdown>
//       </div>
//     </div>
//   );
// };

// export default MarkdownMessage;
