// components/ArticleForm.jsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function ArticleForm({
  initialData = null,
  mode = "create",
  onSubmitSuccess
}) {
  const [activeTab, setActiveTab] = useState("th");
  const [fieldData, setFieldData] = useState({
    th: { title: "", excerpt: "", content: null, keywords: [], penName: "", position: "", compilerName: "", compilerPosition: "", thumbnail: null, preview: null },
    en: { title: "", excerpt: "", content: null, keywords: [], penName: "", position: "", compilerName: "", compilerPosition: "", thumbnail: null, preview: null },
    cn: { title: "", excerpt: "", content: null, keywords: [], penName: "", position: "", compilerName: "", compilerPosition: "", thumbnail: null, preview: null },
  });

  const [inputKeywords, setInputKeywords] = useState({ th: "", en: "", cn: "" });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authorMode, setAuthorMode] = useState("user");
  const [isCompiled, setIsCompiled] = useState(false);

  // Load initial data for edit mode
  useEffect(() => {
    if (initialData && mode === "edit") {
      setFieldData({
        th: {
          title: initialData.titleTh || initialData.title || "",
          excerpt: initialData.excerptTh || initialData.excerpt || "",
          content: initialData.contentTh ? JSON.parse(initialData.contentTh) : (initialData.content ? JSON.parse(initialData.content) : null),
          keywords: initialData.keywordsTh ? initialData.keywordsTh.split(",") : (initialData.keywords ? initialData.keywords.split(",") : []),
          penName: initialData.penNameTh || initialData.penName || "",
          position: initialData.positionTh || initialData.position || "",
          compilerName: initialData.compilerNameTh || initialData.compilerName || "",
          compilerPosition: initialData.compilerPositionTh || initialData.compilerPosition || "",
          thumbnail: null,
          preview: initialData.thumbnailTh || initialData.thumbnail || null
        },
        en: {
          title: initialData.titleEn || "",
          excerpt: initialData.excerptEn || "",
          content: initialData.contentEn ? JSON.parse(initialData.contentEn) : null,
          keywords: initialData.keywordsEn ? initialData.keywordsEn.split(",") : [],
          penName: initialData.penNameEn || "",
          position: initialData.positionEn || "",
          compilerName: initialData.compilerNameEn || "",
          compilerPosition: initialData.compilerPositionEn || "",
          thumbnail: null,
          preview: initialData.thumbnailEn || null
        },
        cn: {
          title: initialData.titleCn || "",
          excerpt: initialData.excerptCn || "",
          content: initialData.contentCn ? JSON.parse(initialData.contentCn) : null,
          keywords: initialData.keywordsCn ? initialData.keywordsCn.split(",") : [],
          penName: initialData.penNameCn || "",
          position: initialData.positionCn || "",
          compilerName: initialData.compilerNameCn || "",
          compilerPosition: initialData.compilerPositionCn || "",
          thumbnail: null,
          preview: initialData.thumbnailCn || null
        }
      });
      setSelectedCategory(initialData.categoryId?.toString() || null);
      setAuthorMode(initialData.authorType || "user");
      setIsCompiled(initialData.isCompiled || false);
    }
  }, [initialData, mode]);

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

  const updateSubField = (lang, field, value) => {
    setFieldData(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  };

  const addKeyword = (lang) => {
    const trimmed = inputKeywords[lang].trim();
    if (trimmed && !fieldData[lang].keywords.includes(trimmed)) {
      updateSubField(lang, "keywords", [...fieldData[lang].keywords, trimmed]);
    }
    setInputKeywords(prev => ({ ...prev, [lang]: "" }));
  };

  const handleKeyDown = (e, lang) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword(lang);
    }
  };

  const handleRemoveKeyword = (lang, keywordToRemove) => {
    updateSubField(lang, "keywords", fieldData[lang].keywords.filter(k => k !== keywordToRemove));
  };

  const handleThumbnailChange = (e, lang) => {
    const file = e.target.files[0];
    if (file) {
      updateSubField(lang, "thumbnail", file);
      updateSubField(lang, "preview", URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFieldData({
      th: { title: "", excerpt: "", content: null, keywords: [], penName: "", position: "", compilerName: "", compilerPosition: "", thumbnail: null, preview: null },
      en: { title: "", excerpt: "", content: null, keywords: [], penName: "", position: "", compilerName: "", compilerPosition: "", thumbnail: null, preview: null },
      cn: { title: "", excerpt: "", content: null, keywords: [], penName: "", position: "", compilerName: "", compilerPosition: "", thumbnail: null, preview: null },
    });
    setSelectedCategory(null);
    setAuthorMode("user");
    setIsCompiled(false);
  };

  const handleSave = async (status = "draft") => {
    // Validation: At least one language must be complete (Title + Content)
    const languages = ["th", "en", "cn"];
    const hasAnyComplete = languages.some(lang => fieldData[lang].title && fieldData[lang].content);

    if (!hasAnyComplete || !selectedCategory) {
      toast.error("บันทึกไม่สำเร็จ", {
        description: !hasAnyComplete ? "กรุณากรอก หัวข้อ และ เนื้อหา อย่างน้อย 1 ภาษา" : "กรุณาเลือกหมวดหมู่",
      });
      return;
    }

    const formData = new FormData();
    formData.append("categoryId", selectedCategory);
    formData.append("status", status);
    formData.append("authorType", authorMode);
    formData.append("isCompiled", isCompiled);

    languages.forEach(lang => {
      const langKey = lang.charAt(0).toUpperCase() + lang.slice(1); // Th, En, Cn
      formData.append(`title${langKey}`, fieldData[lang].title);
      formData.append(`content${langKey}`, fieldData[lang].content ? JSON.stringify(fieldData[lang].content) : "");
      formData.append(`excerpt${langKey}`, fieldData[lang].excerpt);
      formData.append(`keywords${langKey}`, fieldData[lang].keywords.join(","));

      if (fieldData[lang].thumbnail) {
        formData.append(`thumbnail${langKey}`, fieldData[lang].thumbnail);
      }

      if (authorMode === "penname") {
        formData.append(`penName${langKey}`, fieldData[lang].penName);
        formData.append(`position${langKey}`, fieldData[lang].position);
        if (isCompiled) {
          formData.append(`compilerName${langKey}`, fieldData[lang].compilerName);
          formData.append(`compilerPosition${langKey}`, fieldData[lang].compilerPosition);
        }
      }
    });

    const toastId = toast.loading("กำลังบันทึก...");

    try {
      const url = mode === "edit" ? `/api/articles/${initialData.id}` : "/api/articles";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      const resData = await res.json();

      if (!res.ok) {
        toast.error("บันทึกไม่สำเร็จ", { id: toastId, description: resData.message });
        return;
      }

      toast.success(mode === "edit" ? "แก้ไขเรียบร้อยแล้ว" : "บันทึกเรียบร้อยแล้ว", { id: toastId });
      if (mode === "create") resetForm();
      if (onSubmitSuccess) onSubmitSuccess(resData);
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการบันทึก", { id: toastId });
    }
  };

  const tabs = [
    { id: "th", name: "ภาษาไทย", icon: "🇹🇭" },
    { id: "en", name: "English", icon: "🇺🇸" },
    { id: "cn", name: "中文", icon: "🇨🇳" },
  ];

  return (
    <div className="container mx-auto min-h-screen py-10 px-4 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
      {/* LEFT : Editor */}
      <div className="space-y-6">
        {/* Language Tabs */}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100 sticky top-[80px] z-30">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                ? "bg-black text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <span>{tab.icon}</span>
              {tab.name}
              {(fieldData[tab.id].title && fieldData[tab.id].content) && (
                <div className="w-2 h-2 rounded-full bg-green-400 ml-1" />
              )}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {/* Thumbnail */}
          <div className="w-full h-[250px] sm:h-[350px] xl:h-[420px] rounded-3xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center relative overflow-hidden transition-all hover:bg-gray-100">
            {fieldData[activeTab].preview ? (
              <>
                <img src={fieldData[activeTab].preview} alt="thumbnail preview" className="object-cover w-full h-full" />
                <button
                  onClick={() => {
                    updateSubField(activeTab, "thumbnail", null);
                    updateSubField(activeTab, "preview", null);
                  }}
                  className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full z-20 backdrop-blur-sm"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <Upload size={40} strokeWidth={1.5} />
                <span className="font-medium text-sm">อัพโหลดรูปปก ({tabs.find(t => t.id === activeTab).name})</span>
                <span className="text-xs">แนะนำขนาด 1200x630px</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleThumbnailChange(e, activeTab)}
            />
          </div>

          {/* Title */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">หัวข้อข่าว ({activeTab.toUpperCase()})</label>
              <input
                type="text"
                placeholder="กรุณากรอกหัวข้อ..."
                className="w-full outline-none border border-gray-200 focus:border-black rounded-xl px-4 py-3 text-lg font-bold"
                value={fieldData[activeTab].title}
                onChange={(e) => updateSubField(activeTab, "title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">เรื่องย่อ ({activeTab.toUpperCase()})</label>
              <textarea
                rows={3}
                placeholder="อธิบายสรุปสั้นๆ..."
                value={fieldData[activeTab].excerpt}
                onChange={(e) => updateSubField(activeTab, "excerpt", e.target.value)}
                className="w-full outline-none rounded-xl border border-gray-200 px-4 py-3 focus:border-black resize-none"
              />
            </div>
          </div>

          {/* Editor Container */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <label className="text-sm font-semibold text-gray-700 block mb-2">เนื้อหา ({activeTab.toUpperCase()})</label>
            <div className="min-h-[500px]">
              {/* Separate instances per language to avoid data loss on tab switch */}
              {activeTab === "th" && <Editor data={fieldData.th.content} onChange={(val) => updateSubField("th", "content", val)} />}
              {activeTab === "en" && <Editor data={fieldData.en.content} onChange={(val) => updateSubField("en", "content", val)} />}
              {activeTab === "cn" && <Editor data={fieldData.cn.content} onChange={(val) => updateSubField("cn", "content", val)} />}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT : Publish Panel */}
      <aside className="xl:sticky h-fit space-y-6 top-[120px]">
        <div className="rounded-3xl border p-6 space-y-6 bg-white shadow-xl border-gray-100">
          <h3 className="font-bold text-xl text-gray-800">Publish Settings</h3>

          {/* Category */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">หมวดหมู่</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-3 appearance-none bg-gray-50 focus:bg-white transition-all outline-none"
              value={selectedCategory ?? ""}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled>เลือกหมวดหมู่</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Keywords (Per Language) */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">คำค้นหา ({activeTab.toUpperCase()})</label>
            <input
              type="text"
              placeholder="พิมพ์แล้วกด Enter..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black"
              value={inputKeywords[activeTab]}
              onChange={(e) => setInputKeywords(prev => ({ ...prev, [activeTab]: e.target.value }))}
              onKeyDown={(e) => handleKeyDown(e, activeTab)}
            />
            <div className="flex flex-wrap gap-2">
              {fieldData[activeTab].keywords.map((keyword) => (
                <span key={keyword} className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600">
                  {keyword}
                  <button onClick={() => handleRemoveKeyword(activeTab, keyword)} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Author Mode */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700">Author Type</label>
            <div className="flex bg-gray-50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAuthorMode("user")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authorMode === "user" ? "bg-white shadow text-black" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                Logged-in user
              </button>
              <button
                type="button"
                onClick={() => setAuthorMode("penname")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authorMode === "penname" ? "bg-white shadow text-black" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                Pen name
              </button>
            </div>

            {authorMode === "penname" && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                    ข้อมูลนามปากกา ({activeTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    placeholder="นามปากกา / ชื่อเจ้าของ"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
                    value={fieldData[activeTab].penName}
                    onChange={(e) => updateSubField(activeTab, "penName", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="ตำแหน่ง"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
                    value={fieldData[activeTab].position}
                    onChange={(e) => updateSubField(activeTab, "position", e.target.value)}
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-all">
                  <input
                    type="checkbox"
                    checked={isCompiled}
                    onChange={(e) => setIsCompiled(e.target.checked)}
                    className="w-5 h-5 rounded-md border-gray-300 transition-all checked:bg-black"
                  />
                  <span className="text-sm font-bold text-gray-700">มีผู้เรียบเรียง (Compiled by)</span>
                </label>

                {isCompiled && (
                  <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <label className="text-xs font-bold uppercase text-gray-400">ผู้เรียบเรียง ({activeTab.toUpperCase()})</label>
                    <input
                      type="text"
                      placeholder="ชื่อผู้เรียบเรียง"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
                      value={fieldData[activeTab].compilerName}
                      onChange={(e) => updateSubField(activeTab, "compilerName", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="ตำแหน่งผู้เรียบเรียง"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
                      value={fieldData[activeTab].compilerPosition}
                      onChange={(e) => updateSubField(activeTab, "compilerPosition", e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <button
              onClick={() => handleSave("draft")}
              className="w-full border border-gray-200 rounded-2xl py-3 font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              บันทึกร่าง (Draft)
            </button>
            <button
              onClick={() => handleSave("pending")}
              className="w-full bg-[#3F458D] text-white rounded-2xl py-3 font-bold shadow-lg shadow-indigo-100 hover:bg-[#3F458D]/90 active:scale-[0.98] transition-all"
            >
              {mode === "edit" ? "อัปเดตบทความ" : "ส่งขออนุมัติ"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}