import jsPDF from "jspdf";

export async function saveChatAsPDF({
  text,
  filename = "document.pdf",
}: {
  text: string;
  filename?: string;
}) {
  const doc = new jsPDF("p", "pt", "a4");
  doc.text(text, 10, 10);
  doc.save(filename);
}
