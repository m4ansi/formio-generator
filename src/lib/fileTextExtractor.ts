export async function extractText(file: File): Promise<string> {

  const type = file.type;

  // If it's a plain text file
  if (type === "text/plain") {
    return await file.text();
  }

  // If it's a docx (very common for intake forms)
  if (type.includes("word")) {
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(buffer);
  }

  // fallback
  return await file.text();
}
