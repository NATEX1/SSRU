"use client";

import { Button } from "@/components/ui/button";
import { Bolt, LinkIcon, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function layout({ children }) {
  const pathname = usePathname();
  return (
    <div className="flex items-start">
      <aside className="w-64 mr-4 sticky top-2">
        <ul className="space-y-2">
          <li>
            <Button
              variant="ghost"
              asChild
              className={` justify-start w-full rounded-none ${pathname == "/backoffice/settings/account" &&
                " bg-accent text-accent-foreground"
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
              className={` justify-start w-full rounded-none ${pathname == "/backoffice/settings/site" &&
                " bg-accent text-accent-foreground"
                }`}
            >
              <Link href="/backoffice/settings/site">
                <Bolt /> Site Settings
              </Link>
            </Button>
          </li>

          <li>
            <Button
              variant="ghost"
              asChild
              className={` justify-start w-full rounded-none ${pathname == "/backoffice/settings/social-links" &&
                " bg-accent text-accent-foreground"
                }`}
            >
              <Link href="/backoffice/settings/social-links">
                <LinkIcon /> Social links
              </Link>
            </Button>
          </li>
        </ul>
      </aside>

      <main className="flex-1">
        <div className="bg-background p-4 rounded-2xl border max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
