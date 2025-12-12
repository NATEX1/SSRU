"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Share2 } from "lucide-react";

const articles = [
  {
    id: 1,
    category: "เปิดมุมมองอัปฮิลคาร",
    title:
      'วิทยาลัยการเมืองและการปกครอง วิทยาลัยขอต่อต้ายมั่นต่ำ 1 ควนตนึกว์ "ใต้รับงว้ สัจฺจวาน ขยนนท์"',
    excerpt:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione suscipit eius et corrupti pariatur tenetur quia, molestias similique iure sint optio voluptate corporis qui labore dignissimos ducimus non, expedita ipsam voluptas nemo! Et unde, maxime ea necessitatibus eaque doloribus enim, adipisci illo quam nostrum pariatur, incidunt explicabo harum suscipit impedit inventore voluptatum asperiores expedita dicta. Iste ipsam impedit officiis voluptatem quas asperiores harum consequatur praesentium in at magnam, officia dolore, non nesciunt aut quasi ad deserunt? Sequi inventore atque, officia voluptatibus fuga modi at eaque provident, est asperiores unde rem odit itaque rerum, facilis veniam laboriosam quibusdam assumenda? Ea, numquam!",
    image:
      "/assets/images/thumbnail.jpg",
  },
  {
    id: 2,
    category: "กลยุทธ์ธุรกิจ",
    title: "10 กลยุทธ์เพิ่มยอดขายในปี 2025",
    excerpt:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione suscipit eius et corrupti pariatur tenetur quia, molestias similique iure sint optio voluptate corporis qui labore dignissimos ducimus non, expedita ipsam voluptas nemo! Et unde, maxime ea necessitatibus eaque doloribus enim, adipisci illo quam nostrum pariatur, incidunt explicabo harum suscipit impedit inventore voluptatum asperiores expedita dicta. Iste ipsam impedit officiis voluptatem quas asperiores harum consequatur praesentium in at magnam, officia dolore, non nesciunt aut quasi ad deserunt? Sequi inventore atque, officia voluptatibus fuga modi at eaque provident, est asperiores unde rem odit itaque rerum, facilis veniam laboriosam quibusdam assumenda? Ea, numquam!",
    image:
      "/assets/images/thumbnail.jpg",
  },
  {
    id: 3,
    category: "UX/UI Design",
    title: "ออกแบบ UI ยังไงให้ใช้งานง่าย",
    excerpt:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione suscipit eius et corrupti pariatur tenetur quia, molestias similique iure sint optio voluptate corporis qui labore dignissimos ducimus non, expedita ipsam voluptas nemo! Et unde, maxime ea necessitatibus eaque doloribus enim, adipisci illo quam nostrum pariatur, incidunt explicabo harum suscipit impedit inventore voluptatum asperiores expedita dicta. Iste ipsam impedit officiis voluptatem quas asperiores harum consequatur praesentium in at magnam, officia dolore, non nesciunt aut quasi ad deserunt? Sequi inventore atque, officia voluptatibus fuga modi at eaque provident, est asperiores unde rem odit itaque rerum, facilis veniam laboriosam quibusdam assumenda? Ea, numquam!",
    image:
      "/assets/images/thumbnail.jpg",
  },
  {
    id: 4,
    category: "เทคโนโลยี",
    title: "AI ช่วยเพิ่มประสิทธิภาพงานยังไง?",
    excerpt:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione suscipit eius et corrupti pariatur tenetur quia, molestias similique iure sint optio voluptate corporis qui labore dignissimos ducimus non, expedita ipsam voluptas nemo! Et unde, maxime ea necessitatibus eaque doloribus enim, adipisci illo quam nostrum pariatur, incidunt explicabo harum suscipit impedit inventore voluptatum asperiores expedita dicta. Iste ipsam impedit officiis voluptatem quas asperiores harum consequatur praesentium in at magnam, officia dolore, non nesciunt aut quasi ad deserunt? Sequi inventore atque, officia voluptatibus fuga modi at eaque provident, est asperiores unde rem odit itaque rerum, facilis veniam laboriosam quibusdam assumenda? Ea, numquam!",
    image:
      "/assets/images/thumbnail.jpg",
  },
  {
    id: 5,
    category: "การตลาดดิจิทัล",
    title: "Social Media Marketing ยุคใหม่",
    excerpt:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione suscipit eius et corrupti pariatur tenetur quia, molestias similique iure sint optio voluptate corporis qui labore dignissimos ducimus non, expedita ipsam voluptas nemo! Et unde, maxime ea necessitatibus eaque doloribus enim, adipisci illo quam nostrum pariatur, incidunt explicabo harum suscipit impedit inventore voluptatum asperiores expedita dicta. Iste ipsam impedit officiis voluptatem quas asperiores harum consequatur praesentium in at magnam, officia dolore, non nesciunt aut quasi ad deserunt? Sequi inventore atque, officia voluptatibus fuga modi at eaque provident, est asperiores unde rem odit itaque rerum, facilis veniam laboriosam quibusdam assumenda? Ea, numquam!",
    image:
      "/assets/images/thumbnail.jpg",
  },
];

export default function ArticleSlider() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setSlideIndex((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setSlideIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const goToSlide = (index) => {
    setDirection(index > slideIndex ? 1 : -1);
    setSlideIndex(index);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
    }),

    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },

    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.2 },
    }),
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setSlideIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-6 rounded-2xl shadow mb-8">
      <div className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* LEFT: IMAGE */}
          <div className="relative aspect-video bg-gray-100 overflow-hidden rounded-lg">
            <AnimatePresence
              custom={direction}
              mode="popLayout"
              initial={false}
            >
              <motion.img
                key={articles[slideIndex].id}
                src={articles[slideIndex].image}
                alt={articles[slideIndex].title}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full  object-cover"
              />
            </AnimatePresence>

            {/* OPTIONAL: Buttons */}
            {/* <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white text-gray-700 z-10"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white text-gray-700 z-10"
              >
                <ChevronRight size={20} />
              </button> */}
          </div>

          {/* RIGHT: CONTENT */}
          <div className="p-8 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={articles[slideIndex].id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-xs text-[#99A1AF] mb-2">
                  <span className="text-[#F06FAA]">ดร. สมชาย ใจดี</span>{" "}
                  <span>|</span> <span>28 พ.ย. 2023</span>
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {articles[slideIndex].title}
                </h2>

                <p className="text-gray-600 leading-relaxed line-clamp-3">
                  {articles[slideIndex].excerpt}
                </p>

                {/* <div className="text-[#99A1AF] flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3" />
                      <span className="">2,100</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-3" />
                      <span className=""> 560</span>
                    </div>
                  </div> */}
              </motion.div>
            </AnimatePresence>

            {/* DOTS */}
            <div className="flex justify-end gap-2 mt-6">
              {articles.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`h-3 rounded-full transition-all cursor-pointer ${
                    i === slideIndex ? "bg-purple-600 w-8" : "bg-gray-300 w-3"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
