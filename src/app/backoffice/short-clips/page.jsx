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
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Film, Filter, Pencil, Search, Trash, X, GripVertical } from "lucide-react";
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
import AddShortClipDialog from "@/components/backoffice/add-short-clip-dialog";
import EditShortClipDialog from "@/components/backoffice/edit-short-clip-dialog";
import { toast } from "sonner";

// DnD Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

// --- Sortable Row Component ---
function SortableRow({ row }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.original.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
    position: isDragging ? "relative" : "static",
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? "bg-muted shadow-lg" : ""}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {cell.column.id === "drag-handle" ? (
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded"
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [limit, setLimit] = useState(5);
  const [editingItem, setEditingItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      setTotalRecords(data.totalRecords || data.pagination.total);
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
    if (!confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`/api/short-clips/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "ลบข้อมูลไม่สำเร็จ");

      toast.success("ลบข้อมูลสำเร็จ");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = data.findIndex((item) => item.id === active.id);
      const newIndex = data.findIndex((item) => item.id === over.id);

      // Reorder items in the array
      const reorderedData = arrayMove(data, oldIndex, newIndex);

      // Use the existing order values from the current view to maintain relative ordering capability
      // regardless of sort direction (ASC/DESC) or pagination/filtering
      const originalOrders = data.map((item) => item.order);

      const newDataWithUpdatedOrder = reorderedData.map((item, index) => ({
        ...item,
        order: originalOrders[index],
      }));

      // Optimistically update UI
      setData(newDataWithUpdatedOrder);

      // Prepare items for bulk update API
      const updatedItems = newDataWithUpdatedOrder.map((item) => ({
        id: item.id,
        order: item.order,
      }));

      try {
        const res = await fetch("/api/short-clips/bulk", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updatedItems }),
        });

        if (!res.ok) throw new Error("Failed to update order");
        toast.success("อัปเดตลำดับสำเร็จ");
      } catch (error) {
        console.error("DRAG END ERROR:", error);
        toast.error("ไม่สามารถอัปเดตลำดับได้");
        fetchData(); // Rollback if error
      }
    }
  };

  const columns = useMemo(() => [
    {
      id: "drag-handle",
      header: "",
      cell: () => null, // Rendered in SortableRow
    },
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
          <a
            href={shortClip.youtubeUrl || shortClip.videoUrl || "#"}
            target={shortClip.youtubeUrl ? "_blank" : "_self"}
            rel="noreferrer"
            onClick={(e) => {
              if (shortClip.videoUrl) {
                e.preventDefault();
                setSelectedVideo(shortClip);
              }
            }}
            className="block size-40 rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
          >
            {thumbnail ? (
              <img src={thumbnail} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                No Image
              </div>
            )}
          </a>
        );
      },
    },
    {
      accessorKey: "titleTh",
      header: "หัวข้อ (Multilingual)",
      cell: ({ row }) => {
        const item = row.original;
        const titles = [
          { text: item.titleTh, lang: "TH" },
          { text: item.titleEn, lang: "EN" },
          { text: item.titleCn, lang: "CN" },
        ].filter((t) => t.text);

        return (
          <div className="flex flex-col gap-1.5 max-w-[350px]">
            {titles.map((t, i) => (
              <div key={i} className="flex gap-2 items-start leading-tight">
                <span className="bg-muted border text-muted-foreground text-[10px] px-1.5 rounded h-4 flex items-center justify-center shrink-0 mt-0.5 font-bold uppercase">
                  {t.lang}
                </span>
                <span
                  className={`truncate ${i === 0
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground text-sm"
                    }`}
                >
                  {t.text}
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "order",
      header: "ลำดับ",
      cell: ({ row }) => (
        <div className="font-bold text-center w-10">{row.original.order}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const shortClip = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="underline cursor-pointer"
              onClick={() => {
                setEditingItem(shortClip);
                setEditOpen(true);
              }}
            >
              <Pencil className="w-4 h-4 mr-1" /> แก้ไข
            </Button>
            <Button
              variant="ghost"
              className="text-red-500 underline cursor-pointer"
              onClick={() => handleDelete(shortClip.id)}
            >
              <Trash className="w-4 h-4 mr-1" /> ลบ
            </Button>
          </div>
        );
      },
    },
  ], [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id, // Important for DnD
  });

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h2 className="text-4xl font-bold">จัดการคลิปสั้น</h2>
        <AddShortClipDialog onSuccess={fetchData} totalCount={totalRecords} />

        <EditShortClipDialog
          open={editOpen}
          setOpen={setEditOpen}
          data={editingItem}
          onSuccess={fetchData}
        />
      </div>

      <div className="overflow-hidden border rounded-2xl shadow bg-white">
        <div className="flex gap-4 justify-between p-4">
          <Select
            value={limit.toString()}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2">
            <InputGroup className="w-56">
              <InputGroupAddon>
                <Search className="w-4 h-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="ค้นหา..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </InputGroup>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-10 text-muted-foreground border-y">
            กำลังโหลดข้อมูล...
          </div>
        )}

        {!loading && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
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
                <SortableContext
                  items={data.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <SortableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      ไม่พบข้อมูล
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
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
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
            <div className="p-4 bg-[#101828] text-white">
              <h3 className="text-xl font-bold">{selectedVideo.titleTh}</h3>
              <div className="mt-2 flex gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Film className="w-4 h-4" />
                  <span>{selectedVideo.viewCount} views</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedVideo(null)} />
        </div>
      )}
    </div>
  );
}
