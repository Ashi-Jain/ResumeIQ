import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const parseFile = async (file) => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return await parsePDF(file);
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      return await parseDOCX(file);
    } else if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      return await parseText(file);
    } else {
      throw new Error(
        "Unsupported file format. Please upload PDF, DOCX, or TXT files.",
      );
    }
  } catch (error) {
    console.error("File parsing error:", error);
    throw error;
  }
};

const parsePDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          fullText += pageText + "\n";
        }

        resolve({
          text: fullText.trim(),
          fileName: file.name,
          fileType: "pdf",
          pageCount: pdf.numPages,
        });
      } catch (error) {
        reject(new Error("Failed to parse PDF: " + error.message));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};

const parseDOCX = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });

        resolve({
          text: result.value.trim(),
          fileName: file.name,
          fileType: "docx",
          messages: result.messages,
        });
      } catch (error) {
        reject(new Error("Failed to parse DOCX: " + error.message));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};

const parseText = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve({
        text: e.target.result.trim(),
        fileName: file.name,
        fileType: "txt",
      });
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};

export const extractTextFromURL = async (url) => {
  try {
    // This is a simple implementation. For production, you might want to use a backend service
    const response = await fetch(url);
    const html = await response.text();

    // Basic HTML to text conversion
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove script and style elements
    const scripts = doc.querySelectorAll("script, style");
    scripts.forEach((script) => script.remove());

    return doc.body.textContent || doc.body.innerText || "";
  } catch (error) {
    throw new Error("Failed to fetch content from URL: " + error.message);
  }
};

export const validateFile = (file, maxSizeMB = 10) => {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes

  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  const fileName = file.name.toLowerCase();
  const allowedExtensions = [".pdf", ".docx", ".txt"];

  const hasValidType = allowedTypes.includes(file.type);
  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext),
  );

  if (!hasValidType && !hasValidExtension) {
    throw new Error(
      "Invalid file type. Please upload PDF, DOCX, or TXT files.",
    );
  }

  return true;
};
