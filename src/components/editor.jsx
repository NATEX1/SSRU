"use client";

import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";

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
      { name: "left", icon: "⬅️" },
      { name: "center", icon: "↔️" },
      { name: "right", icon: "➡️" },
    ];

    alignments.forEach((align) => {
      const button = document.createElement("button");
      button.type = "button";
      button.classList.add("ce-tune-alignment__button");
      button.innerHTML = align.icon;
      button.title = `Align ${align.name}`;

      if (this.data.alignment === align.name) {
        button.classList.add("ce-tune-alignment__button--active");
      }

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
    
    // Apply CSS to block
    const blockElement = this.api.blocks.getBlockByIndex(
      this.api.blocks.getCurrentBlockIndex()
    ).holder;

    blockElement.style.textAlign = alignment;
  }

  save() {
    return this.data;
  }

  wrap(blockContent) {
    const wrapper = document.createElement("div");
    wrapper.style.textAlign = this.data.alignment || "left";
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
        const blocks = document.querySelectorAll(".ce-block");
        blocks.forEach((block, index) => {
          const blockData = editorData.blocks[index];
          if (blockData?.tunes?.alignmentTune?.alignment) {
            block.style.textAlign = blockData.tunes.alignmentTune.alignment;
          }
        });
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
          padding: 4px 8px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .ce-tune-alignment__button:hover {
          background: #f3f4f6;
        }
        
        .ce-tune-alignment__button--active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        .ce-block[style*="text-align: center"] .ce-paragraph,
        .ce-block[style*="text-align: center"] .ce-header {
          text-align: center !important;
        }
        
        .ce-block[style*="text-align: right"] .ce-paragraph,
        .ce-block[style*="text-align: right"] .ce-header {
          text-align: right !important;
        }
      `}</style>
      <div id={holderId} className="prose max-w-none border rounded-lg p-4 min-h-[300px]" />
    </>
  );
}