import ArticleSlider from "@/components/article-slider";
import MagazineCarousel from "@/components/home/magazine-carousel";
import { getOnePostEachOtherCategory, getCategoryName } from "@/lib/markdown";
import { Calendar, Eye, Share2 } from "lucide-react";

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

export default function Home() {
  const catPost = getOnePostEachOtherCategory();

  return (
    <div>
      <ArticleSlider />

      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex gap-8 flex-1 mb-8">
            <div className="max-w-[563px] min-w-0">
              <MagazineCarousel data={magazines} />
            </div>

            <div className="flex-1 min-w-0 bg-[#F9FAFB] rounded-4xl">
              some block
            </div>
          </div>

          <div>
            <div className="grid grid-cols-4 gap-4">
              {catPost.map((post, i) => {
                if (i == 0) {
                  return (
                    <a key={i} href={`/${post.slug}`} className="col-span-2 ">
                      <div >
                        <div className="flex gap-2 mb-4">
                          <div className="h-8 w-3 p-2 rounded-2xl bg-[#F06FAA]"></div>
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
                    </a>
                  );
                }

                return (
                  <a href={`/${post.slug}`} key={i}>
                    <div className="flex gap-2 mb-4">
                      <div className="h-8 w-3 p-2 rounded-2xl bg-[#F06FAA]"></div>
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
                      <div className="card-body">
                        <h2 className="card-title line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="line-clamp-2">{post.excerpt}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sticky top-20 pt-2 w-[362px] max-[1024px]:hidden">
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
        </div>
      </div>
    </div>
  );
}
