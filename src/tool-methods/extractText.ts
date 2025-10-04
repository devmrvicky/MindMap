// MarkdownMessage.tsx
import React from "react";

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
export const extractText = (node: any): string => {
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
