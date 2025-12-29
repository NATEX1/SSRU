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
import { FilePlus, Pencil, Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const columns = [
    {
      id: "title",
      header: "หัวข้อ",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex gap-4">
            {data.thumbnail ? (
              <img
                src={data.thumbnail}
                className="size-32 object-cover"
                alt={data.title || "Thumbnail"}
              />
            ) : (
              <div className="size-32 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                No Img
              </div>
            )}
            <div className="w-80">
              <p className="font-bold">{data.title || "ไม่มีหัวข้อ"}</p>
              <p className="line-clamp-3">
                {/* {data.excerpt
                  ? data.excerpt.substring(0, 100) + "..."
                  : "ไม่มีรายละเอียด"} */}
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Architecto ex assumenda in, ad nobis laboriosam magnam
                laudantium? Perferendis placeat facilis magnam eveniet
                aspernatur dolorem ratione fugiat. Dolorum corrupti repellendus
                fuga!
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "author",
      header: "ผู้เขียน",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex gap-4 items-center">
            {data.author.image && data.author.image !== "" ? (
              <Avatar>
                <AvatarImage src={data.author.image} alt="User avatar" />
              </Avatar>
            ) : (
              <Avatar>
                <AvatarFallback className={"bg-primary/50"}>
                  {data.author.name ? data.author.name[0] : "U"}{" "}
                  {/* fallback เป็น U ถ้าไม่มีชื่อ */}
                </AvatarFallback>
              </Avatar>
            )}
            <p>{data.author.name || "Unknown"}</p>
          </div>
        );
      },
    },
    { accessorKey: "category.name", header: "หมวดหมู่" },
    { accessorKey: "slug", header: "Slug" },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ getValue }) =>
        getValue()
          .map((t) => t.tag.name)
          .join(", "),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const statusColor =
          {
            draft: "bg-yellow-100 text-yellow-800",
            published: "bg-green-100 text-green-800",
            archived: "bg-gray-100 text-gray-600",
          }[status] || "bg-gray-100 text-gray-600";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
          >
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
          </span>
        );
      },
    },
    {
      id: "createdAt",
      header: "สร้างมื่อ",
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex gap-4">
          <Button variant={"outline"} className={"cursor-pointer"}>
            <Pencil /> <span>Edit</span>
          </Button>
          <Button variant={"outline"} className={"cursor-pointer text-red-500"}>
            <Trash /> <span>Delate</span>
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (search) params.append("q", search);
        if (selectedCategory !== "all")
          params.append("category", selectedCategory);

        const res = await fetch(`/api/articles?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
          setData(json.articles);
          setTotalPages(json.pagination.totalPages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, search, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();

        if (json.success) {
          setCategories(json.data);
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-4xl font-bold">จัดการบทความ</h2>
        <Button>
          <FilePlus /> เพิ่มบทความ
        </Button>
      </div>

      <div className="mb-4 flex gap-4">
        <InputGroup className={"w-sm"}>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="ค้นหา..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <NativeSelect
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <NativeSelectOption value="all">ทั้งหมด</NativeSelectOption>
          {categories.map((cat) => (
            <NativeSelectOption key={cat.id} value={cat.id}>
              {cat.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10 text-muted-foreground">
          กำลังโหลดข้อมูล...
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-hidden rounded-md border">
          <Table>
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
        </div>
      )}
    </div>
  );
}
