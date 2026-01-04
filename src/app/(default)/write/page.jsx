"use client";

import ArticleForm from "@/components/article-form";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  return (
    <ArticleForm
      mode="create"
      onSubmitSuccess={() => router.push("/")}
    />
  );
}