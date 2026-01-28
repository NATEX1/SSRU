"use client";

import { BookOpen } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const res = await fetch("/api/ssru-around?limit=100");
        const json = await res.json();
        if (json.success) {
          setMagazines(json.data);
        }
      } catch (error) {
        console.error("Fetch magazines error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  return (
    <div className="space-y-8 py-12">
      <div className="text-center flex flex-col items-center mt-8">
        <h2 className="text-[#3F458D] text-4xl font-bold uppercase">SSRU Around</h2>
        <div className=" rounded bg-[#F06FAA] w-24 h-1 mt-8"></div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-muted-foreground">
          กำลังโหลด...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {magazines.map((item, i) => (
            <a
              href={item.link || "#"}
              key={i}
              target="_blank"
              rel="noreferrer"
              className="group"
            >
              <div className="card bg-base-100 border shadow-sm hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                <figure className="relative aspect-[3/4] overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  {item.issue && (
                    <div className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#3F458D] shadow-sm">
                      {item.issue}
                    </div>
                  )}
                </figure>

                <div className="card-body p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-[#F06FAA] uppercase tracking-wider">
                      {item.year || "Publication"}
                    </span>
                  </div>
                  <h2 className="card-title text-lg font-bold leading-tight group-hover:text-[#3F458D] transition-colors mb-4 line-clamp-2">
                    {item.title}
                  </h2>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-[#99A1AF] group-hover:text-[#3F458D] transition-colors">
                    <div className="flex gap-2 items-center text-sm font-medium">
                      <BookOpen className="h-4 w-4" />
                      <span>{item.type || "Digital Version"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
          {magazines.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              ยังไม่มีข้อมูล SSRU Around ในขณะนี้
            </div>
          )}
        </div>
      )}
    </div>
  );
}
