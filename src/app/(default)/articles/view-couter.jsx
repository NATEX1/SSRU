'use client'

import React, { useEffect } from "react";

export default function ViewCounter({ slug }) {
  useEffect(() => {
    fetch(`/api/articles/${slug}/view`, { method: "POST" });
  }, [slug]);
  return null;
}
