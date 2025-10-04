import { toast } from "react-toastify";
import { jsPDF } from "jspdf";

export const handleChatShare = () => {
  toast.warn(
    "This feature is under development, please wait for the next update."
  );
  return;
};

export async function shareText({
  text,
  url,
}: {
  text?: string;
  url?: string;
}) {
  if (!text && !url) return;
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Shared Text",
        text,
        url,
      });
      console.log("Text shared successfully");
    } catch (error) {
      console.error("Error sharing text", error);
    }
  } else {
    console.error("Web Share API is not supported in this browser");
  }
}

export async function exportTextAsPDF({
  text,
  filename = "document.pdf",
}: {
  text: string;
  filename?: string;
}) {
  const doc = new jsPDF("p", "pt", "a4");
  doc.text(text, 10, 10);
  // console.log(doc);
  // doc.save(filename);
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Shared Text",
        files: [
          new File([doc.output("blob") as Blob], filename, {
            type: "application/pdf",
            lastModified: Date.now(),
          }),
        ],
      });
      console.log("Text shared successfully");
    } catch (error) {
      console.error("Error sharing text", error);
    }
  } else {
    console.error("Web Share API is not supported in this browser");
  }
}

// interface OklchComponents {
//   l: number;
//   c: number;
//   h: number;
// }

// function convertOklchToRgb(oklch: string): string {
//   // Convert oklch to rgb
//   // This is a simplified conversion, you may need a more accurate algorithm
//   const [l, c, h]: number[] = oklch.match(/\d+/g)!.map(Number);
//   // Simplified conversion logic (replace with accurate conversion if needed)
//   const r: number = Math.round(l + c * Math.cos(h));
//   const g: number = Math.round(l + c * Math.sin(h));
//   const b: number = Math.round(l - c * Math.cos(h));
//   return `rgb(${r}, ${g}, ${b})`;
// }

// interface SanitizeHtml {
//   (html: string): string;
// }

// const sanitizeHtml: SanitizeHtml = (html) => {
//   // Replace oklch colors with rgb
//   const oklchRegex: RegExp = /oklch\(([^)]+)\)/g;
//   return html.replace(oklchRegex, (match: string) => convertOklchToRgb(match));
// };

// export async function exportTextAsPDF({
//   text,
//   filename = "document.pdf",
// }: {
//   text: string;
//   filename?: string;
// }) {
//   const doc = new jsPDF("p", "pt", "a4"); // A4 size, points, portrait orientation

//   // Render Markdown to HTML
//   const htmlContent = await marked(text);

//   // Sanitize HTML to replace oklch colors with rgb
//   const sanitizedHtml = sanitizeHtml(htmlContent);

//   // Convert HTML to PDF
//   doc.html(sanitizedHtml, {
//     callback: async function (pdf) {
//       if (navigator.share) {
//         try {
//           await navigator.share({
//             title: "Shared Text",
//             files: [
//               new File([pdf.output("blob") as Blob], filename, {
//                 type: "application/pdf",
//                 lastModified: Date.now(),
//               }),
//             ],
//           });
//           console.log("Text shared successfully");
//         } catch (error) {
//           console.error("Error sharing text", error);
//         }
//       } else {
//         console.error("Web Share API is not supported in this browser");
//       }
//     },
//     x: 10,
//     y: 10,
//     autoPaging: true,
//   });
// }
