"use client";

import Link from "next/link";

import { CartSheet } from "@/components/CartSheet";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex flex-col">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            My Shop
          </Link>
          <span className="text-sm text-neutral-500">Everyday essentials</span>
        </div>
        <CartSheet />
      </div>
    </header>
  );
}

