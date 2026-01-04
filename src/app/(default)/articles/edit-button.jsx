'use client'

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function EditButton({ authorId, articleId, slug }) {
  const { data: session, status } = useSession();

  if (status !== "authenticated") return null;

  const userId = session.user.id;
  const role = session.user.role; // เช่น "admin"

  const isOwner = userId === authorId;
  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) return null;

  return (
    <Link
      href={`/articles/${slug}/edit`}
      className="text-sm px-3 py-1 rounded-md border border-[#3F458D] text-[#3F458D] hover:bg-[#3F458D] hover:text-white transition"
    >
      แก้ไข
    </Link>
  );
}
