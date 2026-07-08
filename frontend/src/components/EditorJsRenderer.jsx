import React from "react";

// 🔄 Helper function to render nested lists recursively
function showListRecursively(data, id) {
  if (!data) return null;

  // EditorJS nested list standard tags
  const ListTag = data.style === "ordered" ? "ol" : "ul";
  const tailwindClasses = data.style === "ordered" 
    ? "list-decimal ml-6 mb-5 space-y-2 text-lg text-gray-600 maxsixhundread:text-sm midbreakpoint:text-[16px]" 
    : "list-disc ml-6 mb-5 space-y-2 text-lg text-gray-600 maxsixhundread:text-sm midbreakpoint:text-[16px]";

  return (
    <ListTag key={id} className={tailwindClasses}>
      {data.items?.map((item, i) => {
        // EditorJS nested structure me text 'content' me hota hai aur sub-items 'items' array me
        const { content, items } = item;

        return (
          <li key={i}>
            {/* 🟢 Inline tags chalane ke liye dangerouslySetInnerHTML zaroori hai */}
            <span dangerouslySetInnerHTML={{ __html: content }} />
            
            {/* 🔄 Agar is item ke andar aur nested list/items hain, toh recursion call hoga */}
            {items && items.length > 0 && showListRecursively({ style: data.style, items }, `${id}-${i}`)}
          </li>
        );
      })}
    </ListTag>
  );
}

function EditorJSRenderer({ content }) {
  if (!content || !content.blocks) {
    return null;
  }

  return (
    <div className="editor-content">
      {content.blocks.map((block) => {
        const { id, type, data } = block;

        switch (type) {
          // 🟢 Paragraph
          case "paragraph":
            return (
              <p
                key={id}
                className="text-lg leading-relaxed text-gray-600 mb-5 maxsixhundread:text-sm midbreakpoint:text-[16px]"
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            );

          // 🔵 Header
          case "header": {
            const Tag = `h${data.level}`;
            return (
              <Tag
                key={id}
                className="font-bold text-2xl mt-8 mb-4 text-gray-800 maxsixhundread:text-[16px] midbreakpoint:text-xl"
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            );
          }

          // 🟣 Image
          case "image":
            return (
              <div key={id} className="my-8 flex items-center justify-center">
                <img
                  src={data.file.url}
                  alt={data.caption || "Blog image"}
                  className="rounded-xl w-full   shadow-lg"
                />
                {data.caption && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {data.caption}
                  </p>
                )}
              </div>
            );

          // 🟡 Code
          case "rawcode":
            return (
              <div
                key={id}
                className="bg-gray-200 rounded-lg p-5 my-6 overflow-x-auto"
              >
                <pre className="text-gray-700 font-mono text-sm whitespace-pre-wrap">
                  <code>{data.html}</code>
                </pre>
              </div>
            );

          // 🔴 Embed
          case "embed":
            return (
              <div key={id} className="flex justify-center my-8">
                <iframe
                  title="embed-content"
                  src={data.embed}
                  width={data.width || 600}
                  height={data.height || 300}
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-md border"
                />
              </div>
            );

          // 🟠 List (Ab nested lists support karega)
          case "list":
            return showListRecursively(data, id);

          // ⚪ Unknown block
          default:
            return null;
        }
      })}
    </div>
  );
}

export default EditorJSRenderer;