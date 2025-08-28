import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const markdownToHTML = async (markdown: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeStringify);

  // const value = "# Pluto\n\n**Pluto** (minor-planet designation: *13434…";
  const file = await processor.process(markdown);

  return String(file);
};

export default markdownToHTML;
