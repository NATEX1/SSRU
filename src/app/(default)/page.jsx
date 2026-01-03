import ArticleSlider from "@/components/article-slider";
import ClipCarousel from "@/components/home/clip-carousel";
import CommentForm from "@/components/home/comment-form";
import MagazineCarousel from "@/components/home/magazine-carousel";
import { getOnePostEachOtherCategory, getCategoryName } from "@/lib/markdown";
import prisma from "@/lib/prisma";
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
  {
    category: "สนทนาบนเส้นทางงาน",
    href: "/categories/career-path-conversations",
  },
  { category: "งานวิจัยแนะนำ", href: "/categories/featured-research" },
  { category: "สวนสุนันทาเมื่อวันวาน", href: "/categories/ssru-muea-wan" },
  { category: "มุมคิดวันนี้", href: "/categories/thoughts-today" },
  { category: "สารคดีความรู้", href: "/categories/documentary-knowledge" },
  { category: "Hall of fame", href: "/categories/hall-of-fame" },
];

async function getCategoriesWithOneArticle() {
  const cats = await prisma.category.findMany({
    include: {
      articles: {
        where: {
          status: "approved",
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        take: 1, // เอา article แค่ 1 ตัว
        orderBy: { createdAt: "desc" }, // ตัวล่าสุด
      },
    },
  });

  // แปลง articles array ให้เป็น object เดียว
  return cats.map((c) => ({
    ...c,
    article: c.articles[0] || null,
    articles: undefined,
  }));
}

export default async function Home() {
  const cats = await getCategoriesWithOneArticle();

  const popularArticles = await prisma.article.findMany({
    where: {
      status: "approved",
    },
    orderBy: {
      views: "desc",
    },
    take: 7,
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      views: true,
    },
  });

  return (
    <div className="p-6 mb-8">
      <div className="overflow-hidden">
        <ArticleSlider data={cats} />

        <div className="flex items-start gap-4">
          <div className="relative overflow-hidden w-full">
            <div>
              {/* Desktop */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cats.map((cat, i) => {
                    if (!cat.article) return;

                    if (i == 0) {
                      return (
                        <div
                          key={i}
                          className="col-span-1 md:col-span-2 max-w-full overflow-hidden"
                        >
                          <div className="flex items-center gap-2 mb-4 max-w-full">
                            <div className="w-1.5 h-6 rounded-2xl bg-[#F06FAA]"></div>
                            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold wrap-break-word">
                              <a
                                href={`/categories/${cat.slug}`}
                                className="hover:text-[#F06FAA] transition"
                              >
                                {cat.name}
                              </a>
                            </h4>
                          </div>

                          <div className="relative overflow-hidden rounded-2xl max-h-[284px]">
                            <a
                              href={`/articles/${cat.article.slug}`}
                              className="block max-w-full"
                            >
                              <img
                                src={cat.article.thumbnail}
                                alt=""
                                className="w-full max-w-full h-56 sm:h-64 md:h-full object-cover opacity-80 block"
                              />
                            </a>

                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20 max-w-full">
                              <a
                                href={`/articles/${cat.article.slug}`}
                                className="shrink-0"
                              >
                                <h6 className="text-white text-sm sm:text-lg font-semibold leading-snug line-clamp-2 wrap-break-word">
                                  {cat.article.title}
                                </h6>
                              </a>

                              <p className="mt-1 line-clamp-2 text-white/80 text-[11px] sm:text-sm mb-3 sm:mb-4 wrap-break-word">
                                {cat.article.excerpt}
                              </p>

                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex gap-3 flex-wrap text-[10px] sm:text-xs text-white">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 shrink-0" />{" "}
                                    {new Date(
                                      cat.article.createdAt
                                    ).toLocaleDateString("th-Th", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-3 shrink-0" />{" "}
                                    {cat.article.views}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Share2 className="h-3 shrink-0" />{" "}
                                    {cat.article.shareCount}
                                  </div>
                                </div>

                                <a
                                  href={`/articles/${cat.article.slug}`}
                                  className="shrink-0"
                                >
                                  <span className="text-[#F06FAA] text-xs flex items-center whitespace-nowrap">
                                    อ่านต่อ{" "}
                                    <ArrowRight className="h-3 ml-0.5" />
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
                            />
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={i}
                        className="flex flex-col max-w-full overflow-hidden"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-6 rounded-2xl bg-[#F06FAA]"></div>
                          <a
                            href={`/categories/${cat.slug}`}
                            className="hover:text-[#F06FAA] transition"
                          >
                            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold wrap-break-word">
                              {cat.name}
                            </h4>
                          </a>
                        </div>

                        <div className="card border h-full overflow-hidden">
                          <a
                            href={`/articles/${cat.article.slug}`}
                            className="block"
                          >
                            <figure className="max-w-full overflow-hidden">
                              <img
                                src={cat.article.thumbnail}
                                alt={cat.article.title}
                                className="h-40 w-full max-w-full object-cover block"
                              />
                            </figure>
                          </a>

                          <div className="card-body p-2 sm:p-3 max-w-full">
                            <a
                              href={`/articles/${cat.article.slug}`}
                              className="shrink-0"
                            >
                              <h2 className="card-title line-clamp-1 wrap-break-word">
                                {cat.article.title}
                              </h2>
                            </a>

                            <p className="line-clamp-2 wrap-break-word text-sm">
                              {cat.article.excerpt}
                            </p>

                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="size-2.5 shrink-0" />
                                  <span>
                                    {new Date(
                                      cat.article.createdAt
                                    ).toLocaleDateString("th-TH", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="size-2.5 shrink-0" />
                                  <span>{cat.article.views}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Share2 className="size-2.5 shrink-0" />
                                  <span>{cat.article.shareCount}</span>
                                </div>
                              </div>

                              <a
                                href={`/articles/${cat.article.slug}`}
                                className="shrink-0"
                              >
                                <span className="text-[#3F458D] text-xs flex items-center cursor-pointer whitespace-nowrap">
                                  อ่านต่อ{" "}
                                  <ArrowRight className="h-2.5 ml-0.5" />
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

              {/* Mobile */}
              <div className="lg:hidden">
                <div className="grid grid-cols-1 gap-4">
                  {cats.map((category, i) => {
                    if (!category.article) return;

                    return (
                      <div
                        key={i}
                        className="flex flex-col max-w-full overflow-hidden"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-6 rounded-2xl bg-[#F06FAA]"></div>
                          <a
                            href={`/categories/${category.slug}`}
                            className="hover:text-[#F06FAA] transition"
                          >
                            <h4 className="text-lg font-bold wrap-break-word">
                              {category.name}
                            </h4>
                          </a>
                        </div>

                        <div className="card overflow-hidden max-w-full">
                          <a href={`/${category.slug}`} className="block">
                            <figure className="max-w-full overflow-hidden">
                              <img
                                src={category.article.thumbnail}
                                alt={category.article.title}
                                className="h-44 w-full max-w-full object-cover block"
                              />
                            </figure>
                          </a>

                          <div className="card-body p-3 max-w-full">
                            <h2 className="card-title line-clamp-1 wrap-break-word">
                              {category.article.title}
                            </h2>

                            <p className="line-clamp-2 wrap-break-word text-sm">
                              {category.article.excerpt}
                            </p>

                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-2.5 shrink-0" />
                                  <span>
                                    {new Date(
                                      category.article.createdAt
                                    ).toLocaleDateString("th-TH", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-2.5 shrink-0" />
                                  <span>{category.article.views}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Share2 className="h-2.5 shrink-0" />
                                  <span>{category.article.shareCount}</span>
                                </div>
                              </div>

                              <a
                                href={`/${category.slug}`}
                                className="shrink-0"
                              >
                                <span className="text-[#3F458D] text-xs flex items-center cursor-pointer whitespace-nowrap">
                                  อ่านต่อ{" "}
                                  <ArrowRight className="h-2.5 ml-0.5" />
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
            <br />
            <br />
            <div className="flex flex-col lg:flex-row gap-8 flex-1 mb-8">
              <div className="max-w-[563px] min-w-0 bg-[#F9FAFB] py-10 lg:py-16 px-5 lg:px-8 rounded-4xl w-full">
                <MagazineCarousel data={magazines} />
              </div>

              <div className="max-w-[563px] min-w-0 bg-[#F9FAFB] py-10 lg:py-16 px-5 lg:px-8 rounded-4xl w-full">
                <ClipCarousel data={clips} />
              </div>

              {/*  ยอดนิยม (Mobile)  */}
              <div className="lg:hidden mb-8">
                <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-2xl shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-[#F06FAA] rounded" />
                    <h4 className="text-xl font-bold text-[#101828]">
                      ยอดนิยม
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {popularArticles.map((article) => (
                      <a
                        key={article.slug}
                        href={`/${article.slug}`}
                        className="block bg-white border border-[#F3F4F6] rounded-xl overflow-hidden hover:shadow-sm transition"
                      >
                        <div className="flex gap-3 p-3">
                          {/* image */}
                          <div className="w-24 h-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            <img
                              src={article.thumbnail}
                              alt={article.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          {/* text */}
                          <div className="min-w-0 flex-1">
                            <h2 className="card-title line-clamp-1 wrap-break-word">
                              {article.title}
                            </h2>

                            <p className="line-clamp-2 wrap-break-word text-sm text-[#475467] mt-1">
                              {article.excerpt}
                            </p>

                            <div className="mt-2 text-xs text-[#99A1AF]">
                              {article.date}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/*  กล่องรับความเห็น (Mobile)  */}
              <div className="lg:hidden mb-8">
                <CommentForm />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 flex-1 mb-8"></div>
          </div>
          <div className="sticky top-20 pt-2 w-[362px] max-[1024px]:hidden space-y-8">
            {/* Desktop */}
            <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-xl hidden lg:block">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-[#F06FAA] rounded" />
                <h4 className="text-2xl font-bold">ยอดนิยม</h4>
              </div>

              <ul className="flex flex-col gap-4">
                {popularArticles.map((article, i) => (
                  <li key={article.slug}>
                    <a
                      href={`/articles/${article.slug}`}
                      className="flex gap-4 group"
                    >
                      <div className="text-[#E5E7EB] text-3xl font-bold group-hover:text-[#3F458D] transition w-10">
                        {String(i + 1).padStart(2, "0")}
                      </div>

                      <div className="flex-1">
                        <p className="group-hover:text-[#F06FAA] transition line-clamp-1">
                          {article.title}
                        </p>
                        <p className="text-[#99A1AF] text-sm">
                          {new Date(article.createdAt).toLocaleDateString(
                            "th-TH",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {" "}
              <br />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-[#F06FAA] mb-4">
                อ่านข่าวย้อนหลัง
              </h4>
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

                      <div className="flex gap-2 items-center text-[#99A1AF]"></div>
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

        <br />
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
                  &nbsp;&nbsp;&nbsp;&nbsp;เว็บไซต์ข่าวแห่งนี้เป็นหนึ่งในช่องทางการสื่อสารของมหาวิทยาลัยราชภัฏสวนสุนันทา
                  มุ่งมั่นนำเสนอข่าวสารและเรื่องราวที่น่าสนใจด้วยความรับผิดชอบต่อสังคม
                  โดยยึดหลักความถูกต้อง ทันสมัย และเหมาะสมต่อบริบทของสังคมไทย
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;กองบรรณาธิการให้ความสำคัญกับการนำเสนอข้อมูลอย่างสร้างสรรค์
                  รอบด้าน และคำนึงถึงจริยธรรมด้านการสื่อสาร
                  เพื่อทำหน้าที่เป็นสื่อกลางในการถ่ายทอดข้อมูลข่าวสาร
                  เสริมสร้างความเข้าใจ
                  และสร้างการรับรู้ร่วมกันในสังคมอย่างยั่งยืน
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
                <ol className="list-decimal list-inside space-y-3 text-sm md:text-base">
                  <li>
                    บทความต้องเคารพต่อสถาบันพระมหากษัตริย์อย่างสูงสุด ห้ามพาดพิง
                    วิพากษ์วิจารณ์
                    หรือสื่อสารในลักษณะที่อาจก่อให้เกิดการลดทอนพระเกียรติหรือความน่าเชื่อถือของสถาบัน
                    อันอาจเข้าข่ายการกระทำที่ขัดต่อกฎหมาย
                    โดยเฉพาะประมวลกฎหมายอาญา มาตรา 112
                  </li>
                  <li>
                    บทความต้องไม่เปิดเผยข้อมูลส่วนบุคคลที่สามารถระบุตัวตนของบุคคลหรือแหล่งข้อมูลได้
                    โดยเฉพาะในประเด็นที่มีความละเอียดอ่อน ประเด็นข้อกล่าวหา
                    การทุจริต หรือการกระทำที่เกี่ยวข้องกับอาชญากรรม
                    ทั้งนี้เพื่อคุ้มครองสิทธิส่วนบุคคลและหลีกเลี่ยงความเสียหายที่อาจเกิดขึ้น
                  </li>
                  <li>
                    การนำเสนอเนื้อหาที่เกี่ยวข้องกับการเมือง
                    ทั้งในประเทศและต่างประเทศ
                    โดยเฉพาะกรณีที่อาจส่งผลกระทบหรือถูกตีความเชื่อมโยงมายังประเทศไทย
                    หรือสถาบันสำคัญของชาติ ต้องดำเนินการด้วยความรอบคอบ
                    ใช้ถ้อยคำที่เป็นกลาง
                    และตั้งอยู่บนพื้นฐานของข้อเท็จจริงที่เหมาะสม
                  </li>
                  <li>
                    ผู้เขียนควรตระหนักถึงจริยธรรมด้านการสื่อสารและบทบาทของสื่อในสังคม
                    โดยใช้ดุลยพินิจอย่างเหมาะสมในการนำเสนอเนื้อหา
                    อาจมีการพิจารณาจำกัดขอบเขตการนำเสนอ (Self-Censorship)
                    เพื่อหลีกเลี่ยงผลกระทบทางกฎหมาย และเพื่อคงไว้ซึ่งภาพลักษณ์
                    ความน่าเชื่อถือ และความเหมาะสมของวารสารและองค์กร
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
