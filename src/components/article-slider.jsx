"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ArticleSlider({ data }) {
  const articles = data
    .filter((c) => c.article) // ✅ ตัด null ออก
    .map((c) => ({
      id: c.article.id,
      title: c.article.title,
      slug: c.article.slug,
      excerpt: c.article.excerpt,
      image: c.article.thumbnail,
      author: c.article.penName ?? c.article.author?.name ,
      dateText: new Date(c.article.createdAt).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }),
    }));

  // console.log(articles);

  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
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
    <div className="bg-[#F9FAFB] border p-6 rounded-2xl shadow mb-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* image */}
        <div className="relative aspect-video overflow-hidden rounded-lg">
            <AnimatePresence mode="wait">
              <a href={`/articles/${current.slug}`}>
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
              <span className="text-[#F06FAA]">{current.author}</span> | {current.dateText}
            </p>

            <a href={`/articles/${current.slug}`}>
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
                className={`h-3 rounded-full transition-all ${
                  i === slideIndex ? "bg-purple-600 w-8" : "bg-gray-300 w-3"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
