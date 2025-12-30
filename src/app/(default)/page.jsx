import ArticleSlider from "@/components/article-slider";
import ClipCarousel from "@/components/home/clip-carousel";
import CommentForm from "@/components/home/comment-form";
import MagazineCarousel from "@/components/home/magazine-carousel";
import { getOnePostEachOtherCategory, getCategoryName } from "@/lib/markdown";
import { ArrowRight, Calendar, Eye, Share2 } from "lucide-react";

const magazines = [
  {
    image: "/contents/magazine1.jpg",
    issue: "Issue 12",
    year: "2025",
    title: "รอบรั้วแก้วเจ้าจอมฉบับที่ 1",
    type: "Digital Version Available",
    link: "https://online.fliphtml5.com/eakkq/ftzw/",
  },
  {
    image: "/contents/magazine2.jpg",
    issue: "Issue 12",
    year: "2025",
    title: "รอบรั้วแก้วเจ้าจอมฉบับที่ 2",
    type: "Digital Version Available",
    link: "https://online.fliphtml5.com/eakkq/lodv/",
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
const archiveCategories = [
  { category: "มองการไกลกับผู้บริหาร", href: "/categories/executive-thoughts" },
  { category: "สนทนาบนเส้นทางงาน", href: "/categories/career-path-conversations" },
  { category: "งานวิจัยแนะนำ", href: "/categories/featured-research" },
  { category: "สวนสุนันทาเมื่อวันวาน", href: "/categories/ssru-muea-wan" },
  { category: "มุมคิดวันนี้", href: "/categories/thoughts-today" },
  { category: "สารคดีความรู้", href: "/categories/documentary-knowledge" },
  { category: "Hall of fame", href: "/categories/hall-of-fame" },
];

export default function Home() {
  const catPost = getOnePostEachOtherCategory();

  return (
    <div className="p-6 mb-8">
      <div className="overflow-hidden">
        <ArticleSlider />

        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {catPost.map((post, i) => {
                  if (i == 0) {
                    return (
                      <div key={i} className="col-span-1 md:col-span-2 max-w-full overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 max-w-full">
                          <div className="w-1.5 h-6 rounded-2xl bg-[#F06FAA]"></div>
                          <h4 className="text-lg sm:text-xl lg:text-2xl font-bold break-words">
                            <a
                              href={`/categories/${post.category}`}
                              className="hover:text-[#F06FAA] transition"
                            >
                              {getCategoryName(post.category)}
                            </a>
                          </h4>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl max-w-full">
                          <a href={`/${post.slug}`} className="block max-w-full">
                            <img
                              src={post.thumbnail}
                              alt=""
                              className="w-full max-w-full h-56 sm:h-64 md:h-full object-cover opacity-80 block"
                            />
                          </a>

                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20 max-w-full">
                            <h6 className="text-white text-sm sm:text-lg font-semibold leading-snug line-clamp-2 break-words">
                              {post.title}
                            </h6>

                            <p className="mt-1 line-clamp-2 text-white/80 text-[11px] sm:text-sm mb-3 sm:mb-4 break-words">
                              {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              {/* meta */}
                              <div className="flex gap-3 flex-wrap text-[10px] sm:text-xs text-white">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 shrink-0" /> {post.date}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 shrink-0" /> {post.readCount}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Share2 className="h-3 shrink-0" /> {post.shareCount}
                                </div>
                              </div>

                              {/* read more */}
                              <a href={`/${post.slug}`} className="shrink-0">
                                <span className="text-[#F06FAA] text-xs flex items-center whitespace-nowrap">
                                  อ่านต่อ <ArrowRight className="h-3 ml-0.5" />
                                </span>
                              </a>
                            </div>
                          </div>

                          <div
                            className="
                              pointer-events-none
                              absolute inset-0
                              bg-linear-to-b
                              from-transparent from-10%
                              to-black/80 to-100%"
                          ></div>
                        </div>
                      </div>

                    );
                  }

                  return (
                    <div key={i} className="flex flex-col max-w-full overflow-hidden">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-6 rounded-2xl bg-[#F06FAA]"></div>
                        <a
                          href={`/categories/${post.category}`}
                          className="hover:text-[#F06FAA] transition"
                        >
                          <h4 className="text-lg sm:text-xl lg:text-2xl font-bold break-words">
                            {getCategoryName(post.category)}
                          </h4>
                        </a>
                      </div>

                      <div className="card overflow-hidden max-w-full">
                        <a href={`/${post.slug}`} className="block">
                          <figure className="max-w-full overflow-hidden">
                            <img
                              src={post.thumbnail}
                              alt={post.slug}
                              className="h-40 w-full max-w-full object-cover block"
                            />
                          </figure>
                        </a>

                        <div className="card-body p-2 sm:p-3 max-w-full">
                          <h2 className="card-title line-clamp-1 break-words">
                            {post.title}
                          </h2>

                          <p className="line-clamp-2 break-words text-sm">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            {/* meta */}
                            <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-2.5 shrink-0" />
                                <span>28/11/2568</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-2.5 shrink-0" />
                                <span>{post.readCount}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share2 className="h-2.5 shrink-0" />
                                <span>{post.shareCount}</span>
                              </div>
                            </div>

                            {/* read more */}
                            <a href={`/${post.slug}`} className="shrink-0">
                              <span className="text-[#3F458D] text-xs flex items-center cursor-pointer whitespace-nowrap">
                                อ่านต่อ <ArrowRight className="h-2.5 ml-0.5" />
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
            <br /><br />
            <div className="flex flex-col lg:flex-row gap-8 flex-1 mb-8">
              <div className="max-w-[563px] min-w-0 bg-[#F9FAFB] py-10 lg:py-16 px-5 lg:px-8 rounded-4xl w-full">
                <MagazineCarousel data={magazines} />
              </div>

              <div className="max-w-[563px] min-w-0 bg-[#F9FAFB] py-10 lg:py-16 px-5 lg:px-8 rounded-4xl w-full">
                <ClipCarousel data={clips} />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 flex-1 mb-8">

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
            <div> <br /></div>
            <div>
              <h4 className="text-2xl font-bold text-[#F06FAA] mb-4">อ่านข่าวย้อนหลัง</h4>
              <hr className="mb-4" />

              <ul className="space-y-4">
                {archiveCategories.map((item) => (
                  <li key={item.href}>
                    <div>
                      <h6>
                        <a
                          href={item.href}
                          className="hover:text-[#F06FAA] transition"
                        >
                          {item.category}
                        </a>
                      </h6>

                      <div className="flex gap-2 items-center text-[#99A1AF]">
                        {/* เผื่ออยากใส่คำอธิบาย/จำนวนบทความ/อัปเดตล่าสุดในอนาคต */}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* <div className="text-right">
                <a className="text-[#3F458D] hover:underline" href="/categories">
                  อ่านทั้งหมด
                </a>
              </div> */}
            </div>


            <CommentForm />
          </div>
        </div>
        <br /><br />
        <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-6 rounded-2xl shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-2 h-7 rounded-full bg-[#F06FAA]" />
                <h4 className="text-xl md:text-2xl font-bold text-[#101828] leading-tight">
                  สารจากกองบรรณาธิการ
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 items-start">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="/contents/editorial.jpg"
                    alt="สารจากกองบรรณาธิการ"
                    className="w-full object-cover"
                  />
                </div>

                <p className="text-[#475467] leading-relaxed text-sm md:text-base">
                  เว็บไซต์ข่าวนี้เป็นเว็บไซต์หนึ่งของสำนักข่าวสวนสุนันทา
                  เรารายงานข่าวและเรื่องราวน่าสนใจด้วยความตั้งใจ
                  นำเสนอข้อมูลที่ถูกต้อง ทันสมัย และสะท้อนถึงมุมมองในสังคม
                  อย่างสร้างสรรค์ เพื่อเป็นสื่อกลางในการสื่อสารข้อมูลข่าวสาร
                  และสร้างการรับรู้ร่วมกันแก่ประชาชนทุกคน
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-[#E5E7EB]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-2 h-7 rounded-full bg-[#F06FAA]" />
                <h4 className="text-xl md:text-2xl font-bold text-[#101828] leading-tight">
                  เกณฑ์ในการส่งบทความ
                </h4>
              </div>

              <div className="text-[#475467] leading-relaxed text-sm md:text-base">
                <ul>
                  <li>ใช้ ภาษาข่าวทางการ สุภาพ เป็นกลาง</li>
                  <li>โครงสร้างตามหลัก 5W1H (ใคร ทำอะไร ที่ไหน เมื่อไร อย่างไร เพื่ออะไร)</li>
                  <li>ความยาวประมาณ 300–600 คำ</li>
                  <li>มี พาดหัวข่าวชัดเจน + ความนำ + เนื้อข่าว + ปิดท้าย</li>
                  <li>แนบ ภาพกิจกรรม 1–5 ภาพ พร้อมคำบรรยาย</li>
                  <li>ระบุ ชื่อกิจกรรม วันที่ สถานที่ หน่วยงาน และชื่อบุคคล/ตำแหน่งให้ถูกต้อง</li>
                  <li>ไม่ใช้ภาษาการเมือง ไม่โฆษณา ไม่แสดงความคิดเห็นส่วนตัว</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
