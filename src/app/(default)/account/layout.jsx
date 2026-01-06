"use client"

import { Button } from "@/components/ui/button"
import { FileText, UserCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Layout({ children }) {
  const pathname = usePathname()

  const isActive = (path) =>
    pathname === path 

  return (
    <div className="flex items-start gap-8 max-w-5xl mx-auto">
      <aside className="w-64 sticky top-24">
        <ul className="space-y-1">
          <li>
            <Button
              asChild
              variant={isActive("/account") ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <a href="/account">
                <UserCircle className="size-4" />
                Account
              </a>
            </Button>
          </li>

          <li>
            <Button
              asChild
              variant={isActive("/account/articles") ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <a href="/account/articles">
                <FileText className="size-4" />
                My Article
              </a>
            </Button>
          </li>
        </ul>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  )
}
