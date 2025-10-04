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
import { ImgPopup } from "../components/utils/ImgPopup";
import { extractText } from "@/tool-methods/extractText";

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
          : `rounded-2xl min-[520px]:px-4 px-0 py-3 shadow-sm max-w-[100%] whitespace-pre-wrap`
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
                <div className="relative group mt-2">
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
            // detect image and use
            img: (props: any) => {
              return <ImgPopup {...props} />;
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
