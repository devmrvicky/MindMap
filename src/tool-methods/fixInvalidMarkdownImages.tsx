export function fixInvalidMarkdownImages(text: string, isUser: boolean) {
  if (isUser) return text;
  // Matches: ![AltText(https://some-link)]
  const pattern = /!\[([^\(\]\n]+)\((https?:\/\/[^\)\]\s]+)\)/g;
  return text.replace(pattern, "![$1]($2)");
}
