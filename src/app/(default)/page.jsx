import ArticleSlider from "@/components/article-slider";
import ClipCarousel from "@/components/home/clip-carousel";
import CommentForm from "@/components/home/comment-form";
import MagazineCarousel from "@/components/home/magazine-carousel";
import { getOnePostEachOtherCategory, getCategoryName } from "@/lib/markdown";
import { ArrowRight, Calendar, Eye, Share2 } from "lucide-react";


export default function Home() {
  const catPost = getOnePostEachOtherCategory();

  return (
    <div>
      <ArticleSlider />

      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex gap-8 flex-1 mb-8">
            <div className="max-w-[563px] min-w-0 bg-[#F9FAFB] py-16 px-8 rounded-4xl w-full">
              <MagazineCarousel data={magazines} />
            </div>

            <div className="max-w-[563px] min-w-0 bg-[#F9FAFB] py-16 px-8 rounded-4xl w-full">
              <ClipCarousel data={clips} />
            </div>
          </div>

          <div>
            <div className="grid grid-cols-4 gap-4">
              {catPost.map((post, i) => {
                if (i == 0) {
                  return (
                      <div key={i} className="col-span-2 ">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-6 rounded-2xl bg-[#F06FAA]"></div>
                          <h4 className="text-2xl font-bold">
                            {getCategoryName(post.category)}
                          </h4>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl ">
                          <img
                            src={post.thumbnail}
                            alt=""
                            className="opacity-80"
                          />

                          <div className=" absolute bottom-0 left-0 right-0 p-4 z-20">
                            <h6 className="text-white">{post.title}</h6>
                            <p className="line-clamp-2 text-muted text-sm mb-4">
                              {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex gap-4">
                                <div className="flex items-center gap-1 text-white text-xs">
                                  <Calendar className="h-3" /> {post.date}
                                </div>
                                <div className="flex items-center gap-1 text-white text-xs">
                                  <Eye className="h-3" /> {post.readCount}
                                </div>
                                <div className="flex items-center gap-1 text-white text-xs">
                                  <Share2 className="h-3" /> {post.shareCount}
                                </div>
                              </div>

                              <a
                                href={`/${post.slug}`}
                              >
                                <span className="text-[#F06FAA]  text-xs flex items-center">อ่านต่อ <ArrowRight className="h-3" /></span>
                              </a>
                            </div>
                          </div>
                          <div
                            className="
                            absolute inset-0
                            bg-linear-to-b
                            from-transparent from-10%
                            to-black/80 to-100%
                          "
                          ></div>
                        </div>
                      </div>
                  );
                }

                return (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-4" key={i}>
                      <div className="w-1.5 h-6  rounded-2xl bg-[#F06FAA]"></div>
                      <h4 className="text-2xl font-bold">
                        {getCategoryName(post.category)}
                      </h4>
                    </div>

                    <div className="card shadow-sm">
                      <figure>
                        <img
                          src={post.thumbnail}
                          alt=""
                          className="h-40 w-full object-cover"
                        />
                      </figure>
                      <div className="card-body p-1">
                        <h2 className="card-title line-clamp-1">
                          {post.title}
                        </h2>
                        <p className="line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex">
                            <div className="flex items-center text-[10px]">
                              <Calendar className="h-2.5" /> 28/11/2568
                            </div>
                            <div className="flex items-center text-[10px]">
                              <Eye className="h-2.5" /> {post.readCount}
                            </div>
                            <div className="flex items-center text-[10px]">
                              <Share2 className="h-2.5" /> {post.shareCount}
                            </div>
                          </div>
                          <a
                            href={`/${post.slug}`}
                            className="col-span-2 block"
                          >
                            <span className="text-[#3F458D] text-xs flex items-center cursor-pointer">
                              อ่านต่อ <ArrowRight className="h-2.5" />
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sticky top-20 pt-2 w-[362px] max-[1024px]:hidden space-y-8">
          <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-6 bg-[#F06FAA] rounded" />
              <h4 className="text-2xl font-bold">ยอดนิยม</h4>
            </div>

            <ul className="flex flex-col gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <li key={i}>
                  <a href="#" className="flex gap-4 group">
                    <div className="text-[#E5E7EB] text-3xl font-bold group-hover:text-[#3F458D] transition">
                      0{i + 1}
                    </div>

                    <div>
                      <p className="group-hover:text-[#F06FAA] transition">
                        บทความยอดนิยมประจำสัปดาห์ เรื่องที่ {i + 1}
                      </p>
                      <p className="text-[#99A1AF] text-sm">10 นาทีที่แล้ว</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-[#F06FAA] mb-4">อ่านข่าวย้อนหลัง</h4>
            <hr className="mb-4" />
              <ul className="space-y-4">
                <li>
                  <div>
                    <h6>ความล้มเหลวคือบทเรียน</h6>
                    <div className="flex gap-2 items-center text-[#99A1AF]">
                      <div className="flex items-center text-xs">
                        <Eye className="h-3"/> 1,250
                      </div>
                      <div className="flex items-center text-xs">
                        <Share2 className="h-3"/> 553
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <h6>ความสุขสร้างได้เอง</h6>
                    <div className="flex gap-2 items-center text-[#99A1AF]">
                      <div className="flex items-center text-xs">
                        <Eye className="h-3"/> 1,250
                      </div>
                      <div className="flex items-center text-xs">
                        <Share2 className="h-3"/> 553
                      </div>
                    </div>
                  </div>
                </li>
              </ul>

              <div className="text-right">
                <a className="text-[#3F458D] hover:underline" href="">อ่านทั้งหมด</a>
              </div>
          </div>

          <CommentForm />
        </div>
      </div>
    </div>
  );
}

const magazines = [
  {
    image: "/assets/images/ssru-around.jpg",
    issue: "Issue 12",
    year: "2025",
    title: "ฉบับเดือนพฤศจิกายน 2568",
    type: "Digital Version Available",
  },
  {
    image: "/assets/images/ssru-around.jpg",
    issue: "Issue 12",
    year: "2025",
    title: "ฉบับเดือนพฤศจิกายน 2568",
    type: "Digital Version Available",
  },
  {
    image: "/assets/images/ssru-around.jpg",
    issue: "Issue 12",
    year: "2025",
    title: "ฉบับเดือนพฤศจิกายน 2568",
    type: "Digital Version Available",
  },
  {
    image: "/assets/images/ssru-around.jpg",
    issue: "Issue 12",
    year: "2025",
    title: "ฉบับเดือนพฤศจิกายน 2568",
    type: "Digital Version Available",
  },
  {
    image: "/assets/images/ssru-around.jpg",
    issue: "Issue 12",
    year: "2025",
    title: "ฉบับเดือนพฤศจิกายน 2568",
    type: "Digital Version Available",
  },
  {
    image: "/assets/images/ssru-around.jpg",
    issue: "Issue 12",
    year: "2025",
    title: "ฉบับเดือนพฤศจิกายน 2568",
    type: "Digital Version Available",
  },
];

const clips = [
  {
    image: "/assets/images/ssru-around.jpg",
    views: "12.5k",
    title: "Vlog: 1 วันในรั้วสวนสุนันทา",
  },
  {
    image: "/assets/images/ssru-around.jpg",
    views: "12.5k",
    title: "Vlog: 1 วันในรั้วสวนสุนันทา",
  },
  {
    image: "/assets/images/ssru-around.jpg",
    views: "12.5k",
    title: "Vlog: 1 วันในรั้วสวนสุนันทา",
  },
  {
    image: "/assets/images/ssru-around.jpg",
    views: "12.5k",
    title: "Vlog: 1 วันในรั้วสวนสุนันทา",
  },
  {
    image: "/assets/images/ssru-around.jpg",
    views: "12.5k",
    title: "Vlog: 1 วันในรั้วสวนสุนันทา",
  },
  {
    image: "/assets/images/ssru-around.jpg",
    views: "12.5k",
    title: "Vlog: 1 วันในรั้วสวนสุนันทา",
  },
];
