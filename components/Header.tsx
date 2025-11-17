"use client";

import Link from "next/link";

import { CartSheet } from "@/components/CartSheet";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex flex-col">
          <Link 
            href="/" 
            className="text-lg font-semibold tracking-tight sm:text-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded"
            aria-label="Go to homepage"
          >
            My Shop
          </Link>
          <span className="text-xs text-neutral-500 sm:text-sm">Everyday essentials</span>
        </div>
        <CartSheet />
      </div>
    </header>
  );
}

