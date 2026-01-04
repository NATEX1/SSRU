// lib/render.js

export function render(content) {
  if (!content) return "";

  // Parse content ถ้าเป็น string
  let parsedContent = content;
  if (typeof content === "string") {
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      console.error("Error parsing content:", e);
      return "<p>Error loading content</p>";
    }
  }

  if (!parsedContent?.blocks || parsedContent.blocks.length === 0) {
    return "<p>No content available</p>";
  }

  // แปลง blocks เป็น HTML
  const html = parsedContent.blocks
    .map((block) => {
      // ดึง alignment จาก tunes
      const alignment = block.tunes?.alignmentTune?.alignment || "left";
      const alignStyle = `text-align: ${alignment};`;

      switch (block.type) {
        case "header":
          const level = block.data.level || 2;
          return `<h${level} style="${alignStyle}">${block.data.text}</h${level}>`;

        case "paragraph":
          return `<p style="${alignStyle}">${block.data.text}</p>`;

        case "list":
          const listTag = block.data.style === "ordered" ? "ol" : "ul";
          const listClass = block.data.style === "ordered" ? "list-decimal" : "list-disc";
          const items = block.data.items
            .map((item) => `<li>${item}</li>`)
            .join("");
          return `<${listTag} class="${listClass} pl-6" style="${alignStyle}">${items}</${listTag}>`;

        case "quote":
          const caption = block.data.caption
            ? `<footer class="text-sm text-gray-600 mt-2">— ${block.data.caption}</footer>`
            : "";
          return `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4" style="${alignStyle}">
            <p>${block.data.text}</p>
            ${caption}
          </blockquote>`;

        case "image":
          const imgCaption = block.data.caption
            ? `<figcaption class="text-sm text-gray-600 mt-2" style="${alignStyle}">${block.data.caption}</figcaption>`
            : "";
          return `<figure class="my-4" style="${alignStyle}">
            <img src="${block.data.file.url}" alt="${block.data.caption || ""}" class="max-w-full h-auto" />
            ${imgCaption}
          </figure>`;

        default:
          // สำหรับ block type อื่นๆ ที่ไม่รู้จัก
          return `<div style="${alignStyle}"><pre>${JSON.stringify(block, null, 2)}</pre></div>`;
      }
    })
    .join("");

  return html;
}