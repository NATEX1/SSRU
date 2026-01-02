import Link from "next/link";

export default function Pagination({ page, totalPages }) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  const currentPage = Number(page);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Prev */}
      {page > 1 ? (
        <Link
          href={`?page=${page - 1}`}
          className="px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-100"
        >
          ‹ ก่อนหน้า
        </Link>
      ) : (
        <span className="px-4 py-2 text-gray-300">‹ ก่อนหน้า</span>
      )}

      {/* First */}
      {start > 1 && (
        <>
          <Link
            href="?page=1"
            className="px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            1
          </Link>
          <span className="px-2 text-gray-400">…</span>
        </>
      )}

      {/* Pages */}
      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
        <Link
          key={p}
          href={`?page=${p}`}
          className={`px-4 py-2 rounded-lg ${
            p === currentPage
              ? "bg-[#F06FAA] text-white"
              : "text-[#101828] hover:bg-gray-100"
          }`}
        >
          {p}
        </Link>
      ))}

      {/* Last */}
      {end < totalPages && (
        <>
          <span className="px-2 text-gray-400">…</span>
          <Link
            href={`?page=${totalPages}`}
            className="px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next */}
      {page < totalPages ? (
        <Link
          href={`?page=${page + 1}`}
          className="px-4 py-2 rounded-lg text-[#101828] hover:bg-gray-100"
        >
          ถัดไป ›
        </Link>
      ) : (
        <span className="px-4 py-2 text-gray-300">ถัดไป ›</span>
      )}
    </div>
  );
}
