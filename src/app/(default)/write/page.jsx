"use client";

import ArticleForm from "@/components/article-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function page() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSuccess = () => {
    if (session?.user?.role === "admin" || session?.user?.role === "approver") {
      router.push("/backoffice/articles");
    } else {
      router.push("/account/articles");
    }
  };

  return (
    <ArticleForm
      mode="create"
      onSubmitSuccess={handleSuccess}
    />
  );
}