
import ArticleSlider from "@/components/article-slider";
import MagazineCarousel from "@/components/home/magazine-carousel";

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
  return (
    <div>
      <ArticleSlider />

      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex gap-8 flex-1">
            <div className="max-w-[563px] min-w-0">
              <MagazineCarousel data={magazines} />
            </div>

            <div className="flex-1 min-w-0 bg-[#F9FAFB] rounded-4xl">
              some block
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
                      <p className="text-[#99A1AF] text-sm">
                        10 นาทีที่แล้ว
                      </p>
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
