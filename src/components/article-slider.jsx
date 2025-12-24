"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Share2 } from "lucide-react";

const articles = [
  {
    id: 1,
    category: "มองไกลกับผู้บริหาร",
    title: "ผู้นำการสร้างมืออาชีพ: วิสัยทัศน์ที่สะท้อนหัวใจของการพัฒนาคน",
    excerpt:
      "ในวันที่การศึกษาแข่งขันกันด้วยความเร็วของเทคโนโลยีและการแข่งขันของตลาดแรงงาน หน้าที่ของสถาบันอุดมศึกษาไม่ใช่เพียง “ผลิตบัณฑิต” แต่คือ “สร้างมือ...",
    image: "/contents/banner-1.jpg",
    author: "รศ.ดร.ชุติกาญจน์ ศรีวิบูลย์",
    dateText: "28 พ.ย. 2025",
  },
  {
    id: 2,
    category: "สนทนาบนเส้นทางงาน",
    title: 'วิทยาลัยการเมืองและการปกครองวิทยาลัยยอดนิยมอันดับ 1 สวนสุนันทาใต้ร่มเงา “สัณฐาน ชยนนท์”',
    excerpt:
      "วิทยาลัยการเมืองและการปกครอง จัดตั้งขึ้นเมื่อปี 2564 โดยแยกตัวมาจากวิทยาลัยนวัตกรรมและการจัดการ ขณะนั้น มีสาขาวิชาที่เปิดสอนประกอบด้วย รัฐศาสตร์...",
    image: "/contents/banner-2.jpg",
    author: "ผศ. พล.ต.ท.ดร. สัณฐาน ชยนนท์",
    dateText: "12 ม.ค. 2025",
  },
  {
    id: 3,
    category: "แนะนำงานวิจัย",
    title: "บทสรุปสำหรับผู้บริหาร: กลยุทธ์และแนวคิดในการวิจัย การตีพิมพ์ และนวัตกรรม จากมุมมองของผู้ช่วยศาสตราจารย์ ดร.วนิดา วอนสวัสดิ์",
    excerpt:
      "เอกสารฉบับนี้เป็นการสังเคราะห์แก่นความคิด กลยุทธ์ และผลลัพธ์จากการทำงานวิจัยของ ผู้ช่วยศาสตราจารย์ ดร.วนิดา วอนสวัสดิ์ สาขาวิชาเคมี คณะวิทยาศาส...",
    image: "/contents/banner-3.jpg",
    author: "ผศ. ดร.วนิดา วอนสวัสดิ์",
    dateText: "03 มี.ค. 2025",
  },
  {
    id: 4,
    category: "สวนสุนันทาเมื่อวันวาน",
    title: "ปฐมบทแห่งสวนสุนันทา",
    excerpt:
      "“สวนสุนันทา” นามแห่งนี้เป็นสถานที่ที่มีเสน่ห์เฉพาะตัว เสน่ห์ที่มิได้เกิดจากเพียงความสงบร่มรื่น อาคารตำหนักอันสวยงามหรือกำแพงสีแดงโบราณที่ตั้งตระหง่านอยู่...",
    image: "/contents/banner-4.jpg",
    author: "ผศ. วีระ โชติธรรมาภรณ์",
    dateText: "18 เม.ย. 2025",
  },
  {
    id: 5,
    category: "มุมคิดวันนี้",
    title: "คิดแล้ว คิดอีก",
    excerpt:
      "ผมเป็นคนที่ได้ชื่อว่าทำข้อสอบแบบเลือกคำตอบ ประเภท ก. ข. ค. ง. หรือที่เราเรียกกันว่าข้อสอบปรนัยได้รวดเร็วมาก ในเวลา 2 ชั่วโมงที่กำหนดไว้ ผมไม่เคย...",
    image: "/contents/banner-5.jpg",
    author: "รศ.ฤๅเดช เกิดวิชัย",
    dateText: "09 พ.ค. 2025",
  },
  {
    id: 6,
    category: "สารคดีความรู้",
    title: "เพลงที่เพราะที่สุดคือเพลง?",
    excerpt:
      "หากมีคนถามเราว่า เพลงที่เพราะ ไพเราะ หรือเพลงที่เราชอบมากที่สุดคือเพลงอะไร? คงเป็นคำถามที่ตอบได้ยากมากคำถามหนึ่งในชีวิตเลยทีเดียว คำถามนี้อาจใช้...",
    image: "/contents/banner-6.jpg",
    author: "ผศ.วิโรจน์ ศรีหิรัญ",
    dateText: "09 มิ.ย. 2025",
  },
  {
    id: 7,
    category: "Hall of fame",
    title: "เนาวรัตน์..แซ่ย่าง สาวคหกรรมศาสตร์ที่มีพรสวรรค์กีฬาวูซู",
    excerpt:
      "นักศึกษาสาวจากคณะวิทยาศาสตร์และเทคโนโลยี มาจากแม่แจ่ม จังหวัดเชียงใหม่ เรียนด้านคหกรรมศาสตร์ แต่ความสามารถของเธอโดดเด่นยิ่งในด้านกีฬา เนาวรัตน์...",
    image: "/contents/banner-7.jpg",
    author: "เนาวรัตน์ แซ่ย่าง",
    dateText: "21 ก.ค. 2025",
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

  const current = articles[slideIndex];

  return (
    <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-6 rounded-2xl shadow mb-8">
      <div className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-video bg-gray-100 overflow-hidden rounded-lg">
            <AnimatePresence custom={direction} mode="popLayout" initial={false}>
              <motion.img
                key={current.id}
                src={current.image}
                alt={current.title}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          <div className="p-8 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-xs text-[#99A1AF] mb-2">
                  <span className="text-[#F06FAA]">{current.author}</span>{" "}
                  <span>|</span> <span>{current.dateText}</span>
                </p>

                
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {current.title}
                  </h2>
                

                <p className="text-gray-600 leading-relaxed line-clamp-3">
                  {current.excerpt}
                </p>
              </motion.div>
            </AnimatePresence>

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
