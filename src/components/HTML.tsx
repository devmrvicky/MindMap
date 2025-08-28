import { useState, useEffect } from "react";
import markdownToHTML from "@/methods/markdownToHTML";

const HTML = ({ actualResponse }: { actualResponse: string }) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  useEffect(() => {
    const convertToHTML = async () => {
      const html = await markdownToHTML(actualResponse);
      setHtmlContent(html);
    };
    convertToHTML();
  }, [actualResponse]);

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    ></div>
  );
};

export default HTML;
// This component converts markdown to HTML and displays it safely.
