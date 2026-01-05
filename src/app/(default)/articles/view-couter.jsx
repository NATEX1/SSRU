'use client'

import React, { useEffect } from "react";

export default function ViewCounter({ articleId }) {
  useEffect(() => {
    fetch(`/api/articles/${articleId}/view`, { method: "POST" });
  }, [articleId]);
  return null;
}
