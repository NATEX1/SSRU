"use client";

import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { createRoot } from "react-dom/client";

const DEFAULT_INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [],
};

const EDITOR_HOLDER_ID = "editorjs";

// Custom Alignment Tune (ทำเอง)
class AlignmentTune {
  static get isTune() {
    return true;
  }

  constructor({ api, data, config, block }) {
    this.api = api;
    this.data = data || { alignment: config.default || "left" };
    this.config = config;
    this.block = block;
    this.wrapper = null;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("ce-tune-alignment");

    const alignments = [
      { name: "left", Icon: AlignLeft },
      { name: "center", Icon: AlignCenter },
      { name: "right", Icon: AlignRight },
    ];

    alignments.forEach((align) => {
      const button = document.createElement("button");
      button.type = "button";
      button.classList.add("ce-tune-alignment__button");
      button.title = `Align ${align.name}`;

      if (this.data.alignment === align.name) {
        button.classList.add("ce-tune-alignment__button--active");
      }

      // Render Lucide icon using React
      const iconContainer = document.createElement("span");
      const root = createRoot(iconContainer);
      root.render(<align.Icon size={16} />);
      button.appendChild(iconContainer);

      button.addEventListener("click", () => {
        this.setAlignment(align.name);
        // Update button states
        wrapper.querySelectorAll("button").forEach((btn) => {
          btn.classList.remove("ce-tune-alignment__button--active");
        });
        button.classList.add("ce-tune-alignment__button--active");
      });

      wrapper.appendChild(button);
    });

    return wrapper;
  }

  setAlignment(alignment) {
    this.data.alignment = alignment;
    
    // Apply CSS to block holder
    const currentIndex = this.api.blocks.getCurrentBlockIndex();
    const block = this.api.blocks.getBlockByIndex(currentIndex);
    
    if (block && block.holder) {
      const contentDiv = block.holder.querySelector('.ce-block__content');
      if (contentDiv) {
        contentDiv.style.textAlign = alignment;
      }
    }
  }

  save() {
    return this.data;
  }

  wrap(blockContent) {
    const wrapper = document.createElement("div");
    wrapper.style.textAlign = this.data.alignment || "left";
    wrapper.classList.add("alignment-wrapper");
    wrapper.appendChild(blockContent);
    return wrapper;
  }
}

export default function Editor({ data, onChange, holder }) {
  const ref = useRef();
  const isInitializedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  const holderId = holder || EDITOR_HOLDER_ID;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isInitializedRef.current) return;

    let editorData = data;
    if (typeof data === "string") {
      try {
        editorData = JSON.parse(data);
      } catch (e) {
        editorData = DEFAULT_INITIAL_DATA;
      }
    }

    if (!editorData || !editorData.blocks) {
      editorData = DEFAULT_INITIAL_DATA;
    }

    const editor = new EditorJS({
      holder: holderId,
      placeholder: "Start writing here...",
      
      tools: {
        paragraph: {
          class: Paragraph,
          tunes: ["alignmentTune"],
          inlineToolbar: true,
        },
        header: {
          class: Header,
          tunes: ["alignmentTune"],
          inlineToolbar: true,
          config: {
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
          },
        },
        list: {
          class: List,
          tunes: ["alignmentTune"],
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          tunes: ["alignmentTune"],
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        image: {
          class: ImageTool,
          tunes: ["alignmentTune"],
          config: {
            uploader: {
              uploadByFile: async (file) => {
                const formData = new FormData();
                formData.append("image", file);
                const res = await fetch("/api/upload-image", {
                  method: "POST",
                  body: formData,
                });
                return await res.json();
              },
            },
          },
        },
        alignmentTune: {
          class: AlignmentTune,
          config: {
            default: "left",
          },
        },
      },
      
      data: editorData,
      
      onChange: async (api) => {
        setTimeout(async () => {
          try {
            const savedData = await api.saver.save();
            console.log("✅ Saved data:", savedData);
            onChange(savedData);
          } catch (error) {
            console.error("❌ Error:", error);
          }
        }, 100);
      },
      
      onReady: () => {
        console.log("✅ Editor ready");
        isInitializedRef.current = true;
        
        // Apply alignment to existing blocks
        setTimeout(() => {
          if (editorData && editorData.blocks) {
            editorData.blocks.forEach((blockData, index) => {
              const alignment = blockData?.tunes?.alignmentTune?.alignment;
              if (alignment) {
                const block = editor.blocks.getBlockByIndex(index);
                if (block && block.holder) {
                  const contentDiv = block.holder.querySelector('.ce-block__content');
                  if (contentDiv) {
                    contentDiv.style.textAlign = alignment;
                  }
                }
              }
            });
          }
        }, 200);
      },
    });

    ref.current = editor;

    return () => {
      if (ref.current?.destroy) {
        try {
          ref.current.destroy();
          isInitializedRef.current = false;
          ref.current = null;
        } catch (e) {
          console.error("Error destroying editor:", e);
        }
      }
    };
  }, [isMounted, holderId]);

  if (!isMounted) {
    return (
      <div className="prose max-w-none border rounded-lg p-4 text-gray-500">
        Loading editor...
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .ce-tune-alignment {
          display: flex;
          gap: 4px;
          padding: 4px;
        }
        
        .ce-tune-alignment__button {
          padding: 6px 8px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        
        .ce-tune-alignment__button:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .ce-tune-alignment__button--active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .ce-tune-alignment__button--active svg {
          color: white;
        }

        .ce-tune-alignment__button--active:hover svg {
          color: black;
        }
        
        /* Force alignment for all block types */
        .alignment-wrapper {
          width: 100%;
        }
        
        .alignment-wrapper[style*="text-align: center"] * {
          text-align: center !important;
        }
        
        .alignment-wrapper[style*="text-align: right"] * {
          text-align: right !important;
        }
        
        .alignment-wrapper[style*="text-align: left"] * {
          text-align: left !important;
        }
        
        /* Direct block content styling */
        .ce-block__content[style*="text-align: center"] {
          text-align: center !important;
        }
        
        .ce-block__content[style*="text-align: right"] {
          text-align: right !important;
        }
        
        .ce-block__content[style*="text-align: left"] {
          text-align: left !important;
        }
        
        /* Specific element overrides */
        .ce-block__content[style*="text-align: center"] .ce-paragraph,
        .ce-block__content[style*="text-align: center"] .ce-header,
        .ce-block__content[style*="text-align: center"] .cdx-list,
        .ce-block__content[style*="text-align: center"] .cdx-quote {
          text-align: center !important;
        }
        
        .ce-block__content[style*="text-align: right"] .ce-paragraph,
        .ce-block__content[style*="text-align: right"] .ce-header,
        .ce-block__content[style*="text-align: right"] .cdx-list,
        .ce-block__content[style*="text-align: right"] .cdx-quote {
          text-align: right !important;
        }
      `}</style>
      <div id={holderId} className="prose max-w-none border rounded-lg p-4 min-h-[300px]" />
    </>
  );
}