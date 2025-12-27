"use client";

import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";

const DEFAULT_INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [],
};

const EDITTOR_HOLDER_ID = "editorjs";

export default function Editor({ data, onChange, holder }) {
  const ref = useRef();
  const holderId = holder || EDITTOR_HOLDER_ID;

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holderId,
        placeholder: "Start writing here...",
        tools: {
          header: {
            class: Header,
            tunes: ["alignmentTune"],
          },
          list: {
            class: List,
            tunes: ["alignmentTune"],
          },
          paragraph: {
            class: Paragraph,
            tunes: ["alignmentTune"],
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
            class: AlignmentTuneTool,
            config: {
              default: "left",
            },
          },
        },

        data: data || DEFAULT_INITIAL_DATA,

        async onChange(api) {
          const content = await api.saver.save();
          onChange(content);
        },
      });

      ref.current = editor;
    }

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  return <div id={holderId} className="prose max-w-none" />;
}
