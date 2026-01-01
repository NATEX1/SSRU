"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function Page() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [inputKeyword, setInputKeyword] = useState("");
  const [inputTag, setInputTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authorMode, setAuthorMode] = useState("user"); // user | penname
  const [penName, setPenName] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();

        setCategories(data.categories);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  const addKeyword = () => {
    const trimmed = inputKeyword.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
    }
    setInputKeyword(""); // ล้าง input
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file)); // แสดง preview ทันที
    }
  };

  const handleSave = async (status = "draft") => {
    if (!title || !content || !selectedCategory) {
      toast.error("บันทึกไม่สำเร็จ", {
        description: "กรุณากรอก หัวข้อ, เนื้อหา และ หมวดหมู่",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", JSON.stringify(content));
    formData.append("categoryId", selectedCategory);
    formData.append("status", status);
    formData.append("keywords", keywords.join(","));
    formData.append("excerpt", excerpt);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    if (authorMode === "user") {
      formData.append("authorType", "user");
      formData.append("authorId", session.user.id);
    } else {
      formData.append("authorType", "penname");
      formData.append("penName", penName.trim());
    }

    const toastId = toast.loading("กำลังบันทึก...");

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error("บันทึกไม่สำเร็จ", {
          id: toastId,
          description: data.message,
        });
        return;
      }

      toast.success("บันทึกเรียบร้อยแล้ว", { id: toastId });
      setTitle("");
      setExcerpt("");
      setContent(null);
      setSelectedCategory(null);
      setTags([]);
      setAuthorMode("user");
      setPenName("");
      setThumbnail(null);
      setPreview("");

      router.replace("/");
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการบันทึก", { id: toastId });
    }
  };

  return (
    <div>
      <div className="container mx-auto min-h-screen py-10 grid grid-cols-[1fr_400px] gap-4">
        {/* LEFT : Editor */}
        <div className="space-y-4">
          {/* Thumbnail */}
          <div className="w-full h-[420px] rounded-3xl border border-dashed border-gray-300 bg-gray-100 flex items-center justify-center relative overflow-hidden">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="thumbnail preview"
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => {
                    setThumbnail(null);
                    setPreview(null);
                  }}
                  className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <Upload size={32} />
                <span className="font-medium">Upload thumbnail</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleThumbnailChange}
            />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="">หัวข้อ</label>
            <input
              type="text"
              className="w-full outline-none border focus-within:border-black rounded-lg px-4 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="">เนื้อหาย่อ</label>

            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full outline-none rounded-lg border px-4 py-2 focus-within:border-black"
            ></textarea>
          </div>

          {/* Editor */}
          <div>
            <label htmlFor="">เนื้อหา</label>
            <Editor data={content} onChange={setContent} />
          </div>
        </div>

        {/* RIGHT : Publish Panel */}
        <aside className="sticky h-fit space-y-6 top-[120px]">
          <div className="rounded-2xl border p-5 space-y-5 bg-white ">
            <h3 className="font-semibold text-lg">Publish settings</h3>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Category
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={selectedCategory ?? ""}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                คำค้นหา
              </label>

              <input
                type="text"
                placeholder="Press Enter to add keywords"
                className="w-full border rounded-lg px-3 py-2"
                value={inputKeyword}
                onChange={(e) => setInputKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                    <button onClick={() => handleRemoveKeyword(keyword)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Author */}

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-600">
                Author
              </label>

              {/* Mode selector */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthorMode("user")}
                  className={`flex-1 border rounded-lg py-2 text-sm ${
                    authorMode === "user"
                      ? "border-black bg-black text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Logged-in user
                </button>

                <button
                  type="button"
                  onClick={() => setAuthorMode("penname")}
                  className={`flex-1 border rounded-lg py-2 text-sm ${
                    authorMode === "penname"
                      ? "border-black bg-black text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Pen name
                </button>
              </div>

              {/* Pen name input */}
              {authorMode === "penname" && (
                <input
                  type="text"
                  placeholder="Enter pen name"
                  className="w-full border rounded-lg px-3 py-2"
                  value={penName}
                  onChange={(e) => setPenName(e.target.value)}
                />
              )}

              {/* Preview */}
              <p className="text-xs text-gray-500">
                Displayed as:{" "}
                <span className="font-medium text-gray-800">
                  {authorMode === "user" ? "Current user" : penName || "—"}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-3">
              <button
                onClick={() => handleSave("draft")}
                className="w-full border rounded-xl py-2 font-medium hover:bg-gray-50"
              >
                Save draft
              </button>
              <button
                onClick={() => handleSave("pending")}
                className="w-full bg-black text-white rounded-xl py-2 font-medium hover:bg-black/90"
              >
                Submit
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
