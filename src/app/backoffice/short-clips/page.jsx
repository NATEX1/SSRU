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
import { Filter, Pencil, Search, Trash, UserPlus } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import UserDialog from "@/components/backoffice/user-dialog";
import AddShortClipDialog from "@/components/backoffice/add-short-clip-dialog";
import EditShortClipDialog from "@/components/backoffice/edit-short-clip-dialog";

export default function page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [limit, setLimit] = useState(5);
  const [editingItem, setEditingItem] = useState(null); // Item being edited
  const [editOpen, setEditOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit,
        search: search || "",
        role: selectedRole || "",
      });

      const res = await fetch(`/api/short-clips?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setData(data.data);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, selectedRole, limit]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/short-clips/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "ลบข้อมูลไม่สำเร็จ");
      }

      // Refresh data
      fetchData();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const columns = [
    {
      id: "thumbnail",
      header: "รูปปก",
      cell: ({ row }) => {
        const shortClip = row.original;

        const isYoutube = !!shortClip.youtubeUrl;

        const thumbnail = isYoutube
          ? `https://img.youtube.com/vi/${shortClip.youtubeId}/hqdefault.jpg`
          : shortClip.thumbnailUrl;

        return (
          <div className="size-40 rounded-md overflow-hidden bg-muted">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                No Image
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'titleTh',
      header: 'Title (TH)'
    },
    {
      accessorKey: 'titleEn',
      header: 'Title (EN)'
    },
    {
      accessorKey: 'titleCn',
      header: 'Title (CN)'
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const shortClip = row.original

        return <div>
          <Button
            variant="ghost"
            className={'underline cursor-pointer'}
            onClick={() => {
              setEditingItem(shortClip);
              setEditOpen(true);
            }}
          >
            <Pencil /> แก้ไข
          </Button>
          <Button
            variant="ghost"
            className={'text-red-500 underline cursor-pointer'}
            onClick={() => handleDelete(shortClip.id)}
          >
            <Trash /> ลบ
          </Button>
        </div>
      }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h2 className="text-4xl font-bold">จัดการคลิปสั้น</h2>
        <AddShortClipDialog onSuccess={fetchData} />

        <EditShortClipDialog
          open={editOpen}
          setOpen={setEditOpen}
          data={editingItem}
          onSuccess={fetchData}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden border rounded-2xl shadow bg-white">
        <div className="flex gap-4 justify-between p-4">
          <Select
            value={limit.toString()}
            onValueChange={(val) => setLimit(Number(val))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
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
