"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CircleDot, Pencil, Search, Trash, UserPlus } from "lucide-react";
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

export default function page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page,
          q: search,
        });

        if (selectedRole && selectedRole !== "all") {
          params.set("role", selectedRole);
        }

        const res = await fetch(`/api/users?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setData(data.data);
          setTotalPages(data.pagination.totalPages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, search, selectedRole]);

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
                <AvatarFallback className={"bg-primary/50"}>
                  {data.name[0]}
                </AvatarFallback>
              </Avatar>
            )}

            <div>
              <ul>
                <li>ชื่อผู้ใช้: {data.name}</li>
                <li>E-mail: {data.email}</li>
                <li>Role: {data.role}</li>
              </ul>
            </div>
          </div>
        );
      },
    },
    {
      id: "position",
      header: "ตำแหน่ง",
      cell: ({ row }) => "ผู้อำนวยการวิทยาลัยเทคปากช่อง",
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-4xl">จัดการผู้ใช้ในระบบ</h2>
        <Button>
          <UserPlus /> เพิ่มผู้ใช้
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
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <NativeSelectOption value="all">ทั้งหมด</NativeSelectOption>
          <NativeSelectOption value="author">นักเขียน</NativeSelectOption>
          <NativeSelectOption value="approval">ผู้อนุมัติ</NativeSelectOption>
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

      <div className="flex justify-end">
        {totalPages > 1 && (
          <Pagination className="mt-6 justify-end">
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
        )}
      </div>
    </div>
  );
}
