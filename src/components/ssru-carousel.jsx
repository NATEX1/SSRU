'use client'

import { useState, useRef, useEffect } from "react";
import { BookOpen } from "lucide-react";

export default function SSRUCarousel() {
  const slides = [1, 2, 3, 4, 5]; // ข้อมูล slides
  const [activeIndex, setActiveIndex] = useState(0); // state ของ active slide
  const containerRef = useRef(null);

  const scrollToSlide = (index) => {
    const container = containerRef.current;
    if (container) {
      const slideWidth = container.firstChild.offsetWidth + 16; // card width + gap
      container.scrollTo({
        left: slideWidth * index,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToSlide(activeIndex);
  }, [activeIndex]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Carousel */}
      <div
        ref={containerRef}
        className="flex overflow-x-hidden scroll-smooth space-x-4 w-[calc(311px*3)]"
      >
        {slides.map((item) => (
          <div
            key={item}
            className="card bg-white shadow rounded-xl flex-shrink-0 w-[311px]"
          >
            <figure>
              <img
                src="/assets/images/ssru-around.jpg"
                alt=""
                className="w-[311px] h-[433px] object-cover rounded-xl"
              />
            </figure>
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div className="bg-[#3F458D0D] text-[#3F458D] font-bold text-xs p-1 rounded-md">
                  Issue {item}
                </div>
                <div className="font-xs text-[#99A1AF]">2025</div>
              </div>
              <h2 className="card-title">ฉบับเดือนพฤศจิกายน 2568</h2>
              <div className="flex gap-1 items-center text-[#99A1AF]">
                <BookOpen className="h-4" /> <p>Digital Version Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex gap-2 mt-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`btn btn-xs btn-circle ${
              index === activeIndex ? "bg-[#3F458D]" : "bg-gray-300"
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2 mt-4">
        <button className="btn btn-sm" onClick={prevSlide}>
          Prev
        </button>
        <button className="btn btn-sm" onClick={nextSlide}>
          Next
        </button>
      </div>
    </div>
  );
};
