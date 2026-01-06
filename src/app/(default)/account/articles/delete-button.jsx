"use client"

import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import DeleteDialog from "@/components/delete-dialog"

export default function DeleteButton({ id }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)

      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Delete failed")
      }

      toast.success("ลบบทความเรียบร้อย")
      router.refresh()
    } catch (err) {
      toast.error(err.message || "ลบไม่สำเร็จ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DeleteDialog onConfirm={handleDelete}>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600"
        disabled={loading}
      >
        <Trash className="size-4" />
      </Button>
    </DeleteDialog>
  )
}
