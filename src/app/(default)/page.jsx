import ArticleSlider from "@/components/article-slider";
import { ArrowRight, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div>
      <ArticleSlider />

      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex gap-8">
            <div className="flex-1 bg-[#F9FAFB] py-16 px-8 rounded-4xl">
              <div>
                <p className="text-[#F06FAA]">E-BOOK</p>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-[#101828] text-4xl font-bold">
                    SSRU Around
                  </h2>

                  <a href="" className="hover:underline">
                    <div className="text-[#6A7282] flex text-xs items-center">
                      <span>ดูทั้งหมด</span> <ArrowRight className="h-3" />
                    </div>
                  </a>
                </div>

                <div className="carousel carousel-center rounded-box max-w-lg space-x-4">

                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="carousel-item card bg-white shadow rounded-xl shrink-0"
                    >
                      <figure>
                        <img
                          src="/assets/images/ssru-around.jpg"
                          alt=""
                          className=" w-[311px] h-[433px] object-cover"
                        />
                      </figure>
                      <div className="card-body">
                        <div className="flex justify-between items-start">
                          <div className="bg-[#3F458D0D] text-[#3F458D] font-bold text-xs p-1 rounded-md">
                            Issue 12
                          </div>

                          <div className="font-xs text-[#99A1AF]">2025</div>
                        </div>
                        <h2 className="card-title">ฉบับเดือนพฤศจิกายน 2568</h2>
                        <div className="flex gap-1 items-center text-[#99A1AF]">
                          <BookOpen className="h-4" />{" "}
                          <p>Digital Version Available</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 bg-[#F9FAFB] py-16 px-8 rounded-4xl"></div>
          </div>
        </div>

        <div className="sticky top-20 pt-2 w-[362px]">
          <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className=" w-1.5 h-6 bg-[#F06FAA] rounded"></div>
              <h4 className="text-2xl font-bold">ยอดนิยม</h4>
            </div>

            <ul className="flex flex-col gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <li key={i}>
                  <a href="#" className="flex gap-4 group">
                    <div className="text-[#E5E7EB] text-3xl font-bold group-hover:text-[#3F458D] transition-all duration-300">
                      0{i + 1}
                    </div>

                    <div>
                      <p className="group-hover:text-[#F06FAA] transition-all duration-300">
                        บทความยอดนิยมประจำสัปดาห์ เรื่องที่ {i + 1}{" "}
                        ที่คุณไม่ควรพลาด
                      </p>
                      <p className="text-[#99A1AF]">10 นาทีที่แล้ว</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
