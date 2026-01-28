"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, GripVertical, Search } from "lucide-react";
import { toast } from "sonner";
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

import AddVlogDialog from "@/components/backoffice/add-vlog-dialog";
import EditVlogDialog from "@/components/backoffice/edit-vlog-dialog";
import DeleteDialog from "@/components/delete-dialog";

// Sortable Row Component
const SortableRow = ({ row, reorderEnabled }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: row.original.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 0,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={isDragging ? "bg-muted" : ""}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {cell.column.id === "drag" ? (
                        reorderEnabled && (
                            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2">
                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                            </div>
                        )
                    ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                </TableCell>
            ))}
        </TableRow>
    );
};

export default function VlogPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    const [editingVlog, setEditingVlog] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/vlog?page=${page}&search=${search}&limit=10`);
            const json = await res.json();
            if (json.success) {
                setData(json.data);
                setTotal(json.pagination.total);
                setTotalPages(json.pagination.totalPages);
                setTotalRecords(json.totalRecords || json.pagination.total);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("ไม่สามารถดึงข้อมูลได้");
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/vlog/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("ลบข้อมูลสำเร็จ");
                fetchData();
            } else {
                toast.error("ลบข้อมูลไม่สำเร็จ");
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด");
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = data.findIndex((item) => item.id === active.id);
            const newIndex = data.findIndex((item) => item.id === over.id);

            const reorderedData = arrayMove(data, oldIndex, newIndex);

            // Swap orders to maintain DESC sorting logic slots
            const originalOrders = data.map((item) => item.order);
            const newDataWithUpdatedOrder = reorderedData.map((item, index) => ({
                ...item,
                order: originalOrders[index],
            }));

            setData(newDataWithUpdatedOrder);

            try {
                const res = await fetch("/api/vlog/bulk", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ items: newDataWithUpdatedOrder }),
                });
                if (!res.ok) throw new Error();
                toast.success("บันทึกลำดับใหม่สำเร็จ");
            } catch (error) {
                toast.error("ไม่สามารถบันทึกลำดับได้");
                fetchData();
            }
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columns = [
        {
            id: "drag",
            header: "",
        },
        {
            accessorKey: "order",
            header: "ลำดับ",
        },
        {
            id: "thumbnail",
            header: "รูปปก",
            cell: ({ row }) => (
                <div className="w-20 aspect-video rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    <img
                        src={row.original.youtubeId ? `https://i.ytimg.com/vi/${row.original.youtubeId}/mqdefault.jpg` : "https://img.youtube.com/vi/placeholder/mqdefault.jpg"}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://img.youtube.com/vi/placeholder/mqdefault.jpg";
                        }}
                    />
                </div>
            ),
        },
        {
            accessorKey: "titleTh",
            header: "หัวข้อ (TH/EN/CN)",
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <span className="font-medium">{row.original.titleTh}</span>
                    {row.original.titleEn && (
                        <span className="text-xs text-muted-foreground">EN: {row.original.titleEn}</span>
                    )}
                    {row.original.titleCn && (
                        <span className="text-xs text-muted-foreground font-chinese">CN: {row.original.titleCn}</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "youtubeUrl",
            header: "YouTube",
            cell: ({ row }) => (
                <a
                    href={row.original.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline truncate max-w-[200px] block"
                >
                    {row.original.youtubeUrl}
                </a>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => {
                                setEditingVlog(row.original);
                                setIsEditOpen(true);
                            }}
                        >
                            <Pencil className="mr-2 h-4 w-4" /> แก้ไข
                        </DropdownMenuItem>
                        <DeleteDialog onConfirm={() => handleDelete(row.original.id)}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> ลบ
                            </DropdownMenuItem>
                        </DeleteDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Vlog</h2>
                    <p className="text-muted-foreground">จัดการวิดีโอ Vlog ของเว็บไซต์</p>
                </div>
                <AddVlogDialog onSuccess={fetchData} totalCount={totalRecords} />
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="ค้นหาตามหัวข้อ..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={data.map((item) => item.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">กำลังโหลด...</TableCell>
                                    </TableRow>
                                ) : data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">ไม่พบข้อมูล</TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <SortableRow key={row.id} row={row} reorderEnabled={search === ""} />
                                    ))
                                )}
                            </SortableContext>
                        </DndContext>
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <p className="text-sm text-muted-foreground font-medium">
                    ทั้งหมด {total} รายการ
                </p>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        ก่อนหน้า
                    </Button>
                    <div className="text-sm font-medium">
                        หน้า {page} จาก {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        ถัดไป
                    </Button>
                </div>
            </div>

            <EditVlogDialog
                vlog={editingVlog}
                open={isEditOpen}
                setOpen={setIsEditOpen}
                onSuccess={fetchData}
            />
        </div>
    );
}
