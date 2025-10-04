import markdownit from "markdown-it";

const md = new markdownit();

export function extractRawTextFromMarkdown(markdownText: string): string {
  const tokens = md.parse(markdownText, {});

  let rawText = "";

  tokens.forEach((token) => {
    if (token.type === "text") {
      rawText += token.content;
    } else if (token.type === "inline") {
      if (token.children)
        token.children.forEach((child) => {
          if (child.type === "text") {
            rawText += child.content;
          }
        });
    }
  });

  // Remove extra whitespace
  rawText = rawText.replace(/\s+/g, " ").trim();

  return rawText;
}
