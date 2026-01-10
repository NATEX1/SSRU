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

// Custom Embed Tool
class CustomEmbed {
  constructor({ data, api }) {
    this.api = api;
    this.data = {
      service: data.service || "",
      source: data.source || "",
      embed: data.embed || "",
      width: data.width || undefined,
      height: data.height || undefined,
      caption: data.caption || "",
    };

    this.services = {
      youtube: {
        regex: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        embedUrl: "https://www.youtube.com/embed/<%= remote_id %>",
        html: '<iframe style="width:100%; height:320px;" frameborder="0" allowfullscreen></iframe>',
        height: 320,
        width: 580,
      },
    };
  }

  static get toolbox() {
    return {
      title: "Embed",
      icon: '<svg xmlns="www.w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 15.2 0 2 2 0 0 1 1.4 1.4 24.05 24.05 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-15.2 0 2 2 0 0 1-1.4-1.4Z"/><path d="m10 15 5-3-5-3z"/></svg>',
    };
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("embed-tool");

    if (this.data && this.data.embed) {
      const iframe = this.createIframe();
      wrapper.appendChild(iframe);

      const caption = document.createElement("input");
      caption.classList.add("embed-tool__caption");
      caption.placeholder = "Caption (optional)";
      caption.value = this.data.caption || "";
      caption.addEventListener("input", (e) => {
        this.data.caption = e.target.value;
      });
      wrapper.appendChild(caption);
    } else {
      const input = document.createElement("input");
      input.classList.add("embed-tool__input");
      input.placeholder = "Paste a YouTube URL";
      input.addEventListener("paste", (e) => {
        const url = e.clipboardData.getData("text");
        setTimeout(() => this.processUrl(url, wrapper), 100);
      });
      wrapper.appendChild(input);
    }

    return wrapper;
  }

  createIframe() {
    const iframe = document.createElement("iframe");
    iframe.src = this.data.embed;
    iframe.style.width = "100%";
    iframe.style.height = (this.data.height || 320) + "px";
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;
    return iframe;
  }

  processUrl(url, wrapper) {
    for (const [serviceName, service] of Object.entries(this.services)) {
      const match = url.match(service.regex);
      if (match) {
        const remoteId = service.id ? service.id(match.slice(1)) : match[1];
        const embedUrl = service.embedUrl.replace("<%= remote_id %>", remoteId);

        this.data = {
          service: serviceName,
          source: url,
          embed: embedUrl,
          width: service.width,
          height: service.height,
          caption: "",
        };

        wrapper.innerHTML = "";
        const iframe = this.createIframe();
        wrapper.appendChild(iframe);

        const caption = document.createElement("input");
        caption.classList.add("embed-tool__caption");
        caption.placeholder = "Caption (optional)";
        caption.addEventListener("input", (e) => {
          this.data.caption = e.target.value;
        });
        wrapper.appendChild(caption);

        return;
      }
    }
  }

  save() {
    return this.data;
  }

  static get pasteConfig() {
    return {
      patterns: {
        youtube: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      },
    };
  }

  onPaste(event) {
    const { key, data } = event.detail;
    
    const service = this.services[key];
    if (!service) return;

    const match = data.match(service.regex);
    if (match) {
      const remoteId = service.id ? service.id(match.slice(1)) : match[1];
      const embedUrl = service.embedUrl.replace("<%= remote_id %>", remoteId);

      this.data = {
        service: key,
        source: data,
        embed: embedUrl,
        width: service.width,
        height: service.height,
        caption: "",
      };
    }
  }
}

// Custom Alignment Tune
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

      const iconContainer = document.createElement("span");
      const root = createRoot(iconContainer);
      root.render(<align.Icon size={16} />);
      button.appendChild(iconContainer);

      button.addEventListener("click", () => {
        this.setAlignment(align.name);
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

    const currentIndex = this.api.blocks.getCurrentBlockIndex();
    const block = this.api.blocks.getBlockByIndex(currentIndex);

    if (block && block.holder) {
      const contentDiv = block.holder.querySelector(".ce-block__content");
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
        embed: CustomEmbed,
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

        setTimeout(() => {
          if (editorData && editorData.blocks) {
            editorData.blocks.forEach((blockData, index) => {
              const alignment = blockData?.tunes?.alignmentTune?.alignment;
              if (alignment) {
                const block = editor.blocks.getBlockByIndex(index);
                if (block && block.holder) {
                  const contentDiv =
                    block.holder.querySelector(".ce-block__content");
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

        .ce-block__content[style*="text-align: center"] {
          text-align: center !important;
        }

        .ce-block__content[style*="text-align: right"] {
          text-align: right !important;
        }

        .ce-block__content[style*="text-align: left"] {
          text-align: left !important;
        }

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

        /* Embed Tool Styles */
        .embed-tool {
          margin: 20px 0;
        }

        .embed-tool__input {
          width: 100%;
          padding: 12px;
          border: 2px dashed #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .embed-tool__input:focus {
          border-color: #3b82f6;
        }

        .embed-tool iframe {
          border-radius: 8px;
          display: block;
        }

        .embed-tool__caption {
          width: 100%;
          padding: 8px;
          margin-top: 8px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 13px;
          outline: none;
        }

        .embed-tool__caption:focus {
          border-color: #3b82f6;
        }
      `}</style>
      <div
        id={holderId}
        className="prose max-w-none border rounded-lg p-4 min-h-[300px]"
      />
    </>
  );
}