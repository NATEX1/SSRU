"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ArticleSlider({ data }) {
  const getLang = (obj, field) => {
    if (!obj) return "";
    return obj[`${field}Th`] || obj[`${field}En`] || obj[`${field}Cn`] || "";
  };

  const articles = data
    .filter((c) => c.article)
    .map((c) => ({
      id: c.article.id,
      title: getLang(c.article, "title"),
      slug: c.article.slug,
      excerpt: getLang(c.article, "excerpt"),
      image: getLang(c.article, "thumbnail"),
      author: getLang(c.article, "penName") || c.article.author?.name || "SSRU",
      date: c.article.createdAt,
    }));

  // console.log(articles);

  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (articles.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setSlideIndex((i) => (i + 1) % articles.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [articles.length]);

  if (!articles.length) return null;

  const current = articles[slideIndex];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* image */}
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <AnimatePresence mode="wait">
          <a href={`/articles/${current.id}`}>
            <motion.img
              key={current.id}
              src={current.image}
              alt={current.title}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </a>
        </AnimatePresence>
      </div>

      {/* content */}
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-2">
            <span className="text-[#F06FAA]">{current.author}</span> | {mounted ? new Date(current.date).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "long",
              year: "numeric"
            }) : ""}
          </p>

          <a href={`/articles/${current.id}`}>
            <h2 className="text-3xl font-bold mb-4 line-clamp-2 wrap-break-word">
              {current.title}
            </h2>
          </a>

          <p className="text-gray-600 line-clamp-3 wrap-break-word">{current.excerpt}</p>
        </div>

        {/* dots */}
        <div className="flex gap-2 justify-end mt-6">
          {articles.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > slideIndex ? 1 : -1);
                setSlideIndex(i);
              }}
              className={`h-3 rounded-full transition-all ${i === slideIndex ? "bg-primary w-8" : "bg-gray-300 w-3"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
