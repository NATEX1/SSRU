"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArticleForm from "@/components/article-form";

export default function page() {
  const params = useParams();
  const { id } = params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/articles/${id}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to load article");
          return;
        }

        setArticle(data.article);
      } catch (err) {
        console.error(err);
        setError("Error loading article");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  // จัดการหลังบันทึกสำเร็จ - ใช้ slug ใหม่จาก response
  const handleSubmitSuccess = (data) => {
    if (data?.article?.slug) {
      // ใช้ slug ใหม่จาก response (กรณี title เปลี่ยน slug จะเปลี่ยนตาม)
      router.push(`/articles/${data.article.id}`);
    } else {
      // fallback ใช้ slug เดิม
      router.push(`/articles/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen py-10 flex items-center justify-center">
        <p className="text-gray-500">Loading article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto min-h-screen py-10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto min-h-screen py-10 flex items-center justify-center">
        <p className="text-gray-500">Article not found</p>
      </div>
    );
  }

  return (
    <ArticleForm
      mode="edit"
      initialData={article}
      onSubmitSuccess={handleSubmitSuccess}
    />
  );
}