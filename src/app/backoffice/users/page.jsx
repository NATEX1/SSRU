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
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CircleDot,
  Filter,
  Pencil,
  Search,
  Trash,
  UserPlus,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
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

export default function page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);

        if (search) params.append("q", search);
        if (selectedRole && selectedRole !== "all") {
          params.append("role", selectedRole);
        }

        const res = await fetch(`/api/users?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
          setData(json.users);
          setTotalPages(json.pagination.totalPages);
          setTotal(json.pagination.total);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [page, search, selectedRole, limit]);

  const columns = [
    {
      header: "ผู้ใช้",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="flex gap-4">
            {data.image && data.image !== "" ? (
              <Avatar>
                <AvatarImage src={data.image} alt="User avatar" />
              </Avatar>
            ) : (
              <Avatar>
                <AvatarFallback>{data.name[0]}</AvatarFallback>
              </Avatar>
            )}

            <div>
              <ul>
                <li>ชื่อผู้ใช้: {data.name}</li>
                <li>ตำแหน่ง: {data.position || "นักศึกษา"}</li>
                <li>อีเมล: {data.email}</li>
              </ul>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "บทบาท",
      cell: ({ row }) => {
        const role = row.original.role;

        if (role === "admin") return "ผู้ดูแลระบบ";
        if (role === "approver") return "ผู้อนุมัติ";
        if (role === "author") return "ผู้เขียน";

        return "ผู้ใช้ทั่วไป";
      },
    },
    {
      id: "status",
      header: "สถานะ",
      cell: ({ row }) => (
        <div>
          <StatusBadge status={row.original.status} />
        </div>
      ),
    },
    {
      id: "createdAt",
      header: "เข้าร่วมเมื่อ",
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
        <div className="flex gap-1">
          <Button variant={"ghost"} className={"cursor-pointer underline"}>
            <Pencil className="size-4" /> แก้ไข
          </Button>
          <DeleteDialog onConfirm={() => console.log("ลบแล้วนะจ๊ะ")}>
            <Button
              variant={"ghost"}
              className={"cursor-pointer  underline text-red-500"}
            >
              <Trash className="size-4" /> ลบ
            </Button>
          </DeleteDialog>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h2 className="text-4xl font-bold">จัดการผู้ใช้ในระบบ</h2>
        <Button>เพิ่มผู้ใช้</Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden border rounded-2xl shadow bg-white">
        <div className="flex gap-4 justify-between p-4">
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
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                >
                  <DropdownMenuRadioItem value="all">
                    ทั้งหมด
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="author">
                    ผู้เขียน
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="approver">
                    ผู้อนุมัติ
                  </DropdownMenuRadioItem>
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
          <Table className={"tborder-y"}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
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
                <TableRow className={"p-4"}>
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
