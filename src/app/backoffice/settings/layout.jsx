"use client";

import { Button } from "@/components/ui/button";
import { Bolt, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function layout({ children }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 mr-8">
        <ul className="space-y-2">
          <li>
            <Button
              variant="ghost"
              asChild
              className={` justify-start w-full rounded-none ${
                pathname == "/backoffice/settings/account" &&
                "border-r-2 border-primary bg-accent text-accent-foreground"
              }`}
            >
              <Link href="/backoffice/settings/account">
                <UserCircle /> Account
              </Link>
            </Button>
          </li>

          <li>
            <Button
              variant="ghost"
              asChild
              className={` justify-start w-full rounded-none ${
                pathname == "/backoffice/settings/site" &&
                "border-r-2 border-primary bg-accent text-accent-foreground"
              }`}
            >
              <Link href="/backoffice/settings/site">
                <Bolt /> Site Settings
              </Link>
            </Button>
          </li>
        </ul>
      </aside>

      <main className="flex-1">
        <div className="bg-background p-4 rounded-2xl border max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
