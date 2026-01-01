"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Archive,
  BadgeCheck,
  Check,
  Clock,
  FilePlus,
  Filter,
  Pencil,
  Search,
  Trash,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteDialog from "@/components/delete-dialog";
import ApproveDialog from "@/components/backoffice/approve-dialog";
import RejectDialog from "@/components/backoffice/reject-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const router = useRouter();

  const handleApprove = async (slug) => {
    try {
      const res = await fetch(`/api/articles/${slug}/approve`, {
        method: "POST",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Approve failed");
      }

      toast.success("สำเร็จ", {
        description: "อนุมัติบทความเรียบร้อยแล้ว",
      });

      await fetchArticles();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด", {
        description: error.message || "ไม่สามารถอนุมัติได้",
      });
    }
  };

  const handleReject = async (slug, comment) => {
    try {
      const res = await fetch(`/api/articles/${slug}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Reject failed");
      }

      toast.success("สำเร็จ", { description: "ไม่อนุมัติบทความเรียบร้อยแล้ว" });

      await fetchArticles();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด", {
        description: error.message || "ไม่สามารถไม่อนุมัติได้",
      });
    }
  };

  const columns = [
    {
      accessorKey: "title",
      header: "หัวข้อ",
    },
    {
      id: "author",
      header: "ผู้เขียน",
      cell: ({ row }) => {
        const { author, authorType, penName } = row.original;

        const displayName =
          authorType == "penname" ? penName : author?.name || "Unknown";

        return (
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarFallback>{displayName?.[0] || "U"}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <p className="font-medium">{displayName}</p>

              {authorType !== "prename" && (
                <p className="text-xs text-muted-foreground">{author?.email}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category.name",
      header: "หมวดหมู่",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusConfig = {
          pending: {
            label: "รออนุมัติ",
            class: "bg-yellow-100 text-yellow-800 border-yellow-800",
            icon: Clock,
          },
          approved: {
            label: "อนุมัติแล้ว",
            class: "bg-green-100 text-green-800 border-green-800",
            icon: BadgeCheck,
          },
          rejected: {
            label: "ไม่อนุมัติ",
            class: "bg-red-100 text-red-800 border-red-800",
            icon: XCircle,
          },
          draft: {
            label: "ฉบับร่าง",
            class: "bg-gray-100 text-gray-600 border-gray-600",
            icon: Pencil,
          },
        };

        const status = row.original.status;
        const cfg = statusConfig[status];

        return (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 border ${cfg.class}`}
          >
            <cfg.icon className="h-3 w-3" />
            {cfg.label}
          </span>
        );
      },
    },
    {
      id: "createdAt",
      header: "สร้างเมื่อ",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);

        return date.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      id: "approval",
      header: "การอนุมัติ",
      cell: ({ row }) => {
        const { status, approvedBy, approvedAt, rejectReason } = row.original;

        if (status === "approved") {
          return (
            <div className="text-xs">
              <p className="font-medium text-green-700">
                อนุมัติโดย {approvedBy?.name}
              </p>
              <p className="text-muted-foreground">
                {new Date(approvedAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          );
        }

        if (status === "rejected") {
          return (
            <div className="text-xs text-red-700">
              <p className="font-medium">ไม่อนุมัติ</p>
              <p className="italic line-clamp-2">{rejectReason}</p>
            </div>
          );
        }

        return <span className="text-muted-foreground text-xs">—</span>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const article = row.original;

        return (
          <div className="flex gap-2">
            {/* Approve */}
            <ApproveDialog onApprove={() => handleApprove(article.slug)}>
              <Button
                variant="ghost"
                size="sm"
                className=" underline"
                disabled={article.status == "draft"}
              >
                <Check className="size-4" />
                อนุมัติ
              </Button>
            </ApproveDialog>

            <RejectDialog
              onSubmit={(comment) => handleReject(article.slug, comment)}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 underline"
                disabled={article.status == "draft"}
              >
                <X className="size-4" />
                ไม่อนุมัติ
              </Button>
            </RejectDialog>
          </div>
        );
      },
    },
  ];

  const fetchArticles = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) params.append("q", search);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);

      const res = await fetch(`/api/articles?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setData(json.articles);
        setTotalPages(json.pagination.totalPages);
        setTotal(json.pagination.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(fetchArticles, 500);
    return () => clearTimeout(handler);
  }, [page, search, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();

        if (json.success) {
          setCategories(json.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold">จัดการบทความ</h2>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl shadow border bg-white">
        <div className="p-4 flex gap-1 justify-between">
          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={5}>5</SelectItem>
              <SelectItem value={10}>10</SelectItem>
              <SelectItem value={25}>25</SelectItem>
              <SelectItem value={50}>50</SelectItem>
              <SelectItem value={100}>100</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end">
            <InputGroup className={"w-56"}>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="ค้นหา..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"}>
                  <Filter />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>เลือกหมวดหมู่</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <DropdownMenuRadioItem value="all">
                    ทั้งหมด
                  </DropdownMenuRadioItem>
                  {categories.map((cat) => (
                    <DropdownMenuRadioItem value={cat.id} key={cat.id}>
                      {cat.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10 text-muted-foreground border-y">
            กำลังโหลดข้อมูล...
          </div>
        )}

        {!loading && (
          <Table className={"border-y"}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <Pagination className="p-4 justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {data.length > 0
              ? `แสดง ${(page - 1) * limit + 1} - ${Math.min(
                  page * limit,
                  total
                )} จากทั้งหมด ${total}`
              : ""}
          </div>

          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {/* Page numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
