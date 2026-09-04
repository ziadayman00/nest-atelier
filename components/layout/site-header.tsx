"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useWishlist } from "@/providers/wishlist-provider";
import { useNotifications } from "@/providers/notifications-provider";
import { cn } from "@/lib/utils/cn";
import { NestLogo } from "@/components/brand/nest-logo";
import { formatDate } from "@/lib/utils/format";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDrawerOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Close drawer/popover on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close notifications popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Atelier" },
    { href: "/collections", label: "Collections" },
    { href: "/design-consultation", label: "Spatial Planning" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out-expo px-3 sm:px-6 lg:px-12 pointer-events-none",
          scrolled ? "py-1.5 sm:py-2.5" : "py-2.5 sm:py-4 lg:py-5"
        )}
      >
        <div className="max-w-7xl mx-auto pointer-events-auto">
          {/* iOS Dynamic Island Navigation Pill */}
          <div
            className={cn(
              "w-full flex items-center justify-between rounded-full px-3.5 sm:px-5 lg:px-6 transition-all duration-500",
              scrolled
                ? "h-[54px] sm:h-[60px] lg:h-[62px] ios-glass-nav-scrolled"
                : "h-[58px] sm:h-[64px] lg:h-[66px] ios-glass-nav"
            )}
          >
            {/* Left: NEST Brand Identity */}
            <Link
              href="/"
              className="group flex items-center gap-2 transition-transform duration-300 active:scale-95 shrink-0"
              aria-label="NEST Atelier Home"
            >
              <NestLogo
                variant="full"
                color="dark"
                className="transition-opacity duration-300 group-hover:opacity-80"
              />
            </Link>

            {/* Center: iOS Segmented Control Track */}
            <nav
              className="hidden lg:flex items-center ios-segmented-track"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "ios-segmented-item",
                      active && "ios-segmented-item-active"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: iOS Controls & Actions */}
            <div className="hidden lg:flex items-center gap-2.5 sm:gap-3">
              {/* Saved / Wishlist Button */}
              {user && (
                <Link
                  href="/account/wishlist"
                  className="relative flex items-center justify-center w-10 h-10 rounded-full ios-glass-button text-[#161716] active:scale-95"
                  title="Saved Pieces (Wishlist)"
                >
                  <svg
                    className="h-4 w-4 transition-transform group-hover:scale-110"
                    fill={wishlistItems.length > 0 ? "#B86A44" : "none"}
                    viewBox="0 0 24 24"
                    stroke={wishlistItems.length > 0 ? "#B86A44" : "currentColor"}
                    strokeWidth={1.6}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#B86A44] text-[9px] font-bold text-white shadow-xs">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              )}

              {/* Shopping Bag Button */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-full ios-glass-button text-[#161716] active:scale-95"
                title="Shopping Bag"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"
                  />
                </svg>
              </Link>

              {/* Notifications Popover */}
              {user && (
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(!notifOpen)}
                    className={cn(
                      "relative flex items-center justify-center w-10 h-10 rounded-full ios-glass-button text-[#161716] active:scale-95 cursor-pointer",
                      notifOpen && "bg-white/80 border-white shadow-xs"
                    )}
                    title="Notifications"
                    aria-label="Notifications"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.6}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#4A5E4C] text-[9px] font-bold text-white shadow-xs animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* iOS Liquid Glass Dropdown Popover */}
                  {notifOpen && (
                    <div className="absolute right-0 mt-3.5 w-80 sm:w-96 rounded-[28px] ios-glass-dropdown p-5 space-y-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between border-b border-[#E2DCD2]/60 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-lg text-[#161716] font-medium">
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="rounded-full bg-[#4A5E4C] px-2 py-0.5 text-[10px] font-semibold text-white">
                              {unreadCount} unread
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllAsRead}
                            className="text-[11px] font-semibold text-[#4A5E4C] hover:underline cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto space-y-2 no-scrollbar">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                if (!n.isRead) markAsRead(n.id);
                              }}
                              className={cn(
                                "p-3.5 rounded-2xl border transition-all text-xs space-y-1 cursor-pointer",
                                !n.isRead
                                  ? "bg-white/80 border-[#4A5E4C]/30 shadow-xs font-medium"
                                  : "border-transparent bg-white/40 hover:bg-white/60 text-[#6B7068]"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#161716]">{n.title}</span>
                                <span className="text-[10px] text-[#6B7068]">
                                  {formatDate(n.createdAt)}
                                </span>
                              </div>
                              <p className="text-[11px] leading-relaxed text-[#6B7068]">
                                {n.message}
                              </p>
                              {n.link && (
                                <Link
                                  href={n.link}
                                  className="inline-block pt-1 text-[11px] font-semibold text-[#4A5E4C] hover:underline"
                                >
                                  View details ↗
                                </Link>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 space-y-1">
                            <p className="text-xs font-medium text-[#161716]">No new notices</p>
                            <p className="text-[11px] text-[#6B7068]">
                              Your commission updates will appear here
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-[#E2DCD2]/60 pt-2 text-center">
                        <Link
                          href="/account/notifications"
                          onClick={() => setNotifOpen(false)}
                          className="text-xs font-semibold text-[#161716] hover:text-[#4A5E4C] transition-colors inline-flex items-center gap-1"
                        >
                          <span>Full Inbox</span>
                          <span>↗</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Account / Consultation CTA */}
              {user ? (
                <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-black/[0.08]">
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="hidden xl:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold text-[#4A5E4C] bg-[#4A5E4C]/10 hover:bg-[#4A5E4C]/15 transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full ios-glass-button text-xs font-medium text-[#161716] active:scale-95"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#161716] text-white flex items-center justify-center font-mono text-[11px] font-bold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden sm:inline">{user.fullName.split(" ")[0]}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-9 h-9 rounded-full ios-glass-button flex items-center justify-center text-[#6B7068] hover:text-red-600 active:scale-95 transition-colors cursor-pointer"
                    title="Log Out"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3 pl-1">
                  <Link
                    href="/login"
                    className="px-3.5 py-2 text-xs font-medium text-[#6B7068] hover:text-[#161716] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/design-consultation"
                    className="inline-flex items-center gap-2 rounded-full bg-[#161716] px-5 py-2 text-xs font-medium text-white shadow-[0_4px_16px_-4px_rgba(22,23,22,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:bg-[#374739] active:scale-95 transition-all"
                  >
                    <span>Consultation</span>
                    <span className="text-xs">↗</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile View Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
              {user && (
                <Link
                  href="/account/notifications"
                  aria-label="Notifications"
                  className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full ios-glass-button flex items-center justify-center text-[#161716] active:scale-95"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#4A5E4C] text-[9px] font-bold text-white shadow-xs animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}
              <Link
                href="/cart"
                aria-label="Shopping Bag"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ios-glass-button flex items-center justify-center text-[#161716] active:scale-95"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"
                  />
                </svg>
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ios-glass-button flex items-center justify-center text-[#161716] active:scale-95 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (iOS Liquid Sheet) */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-[#161716]/40 backdrop-blur-md lg:hidden transition-opacity duration-300",
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setDrawerOpen(false)}
      />

      <div
        className={cn(
          "fixed top-3 right-3 bottom-3 z-[70] flex w-[320px] max-w-[calc(100vw-24px)] h-[calc(100dvh-24px)] flex-col rounded-[32px] ios-glass-dropdown p-6 shadow-2xl transition-transform duration-400 ease-out-expo lg:hidden overflow-y-auto overscroll-contain",
          drawerOpen ? "translate-x-0" : "translate-x-[110%]"
        )}
      >
        <div className="flex items-center justify-between border-b border-[#E2DCD2]/70 pb-4">
          <div className="flex items-center gap-2.5">
            <NestLogo variant="compact" color="dark" />
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 rounded-full ios-glass-button flex items-center justify-center text-lg text-[#6B7068] active:scale-95 cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Grouped iOS Navigation Items */}
        <nav className="mt-6 flex flex-col gap-2">
          <span className="text-[10px] font-semibold font-mono tracking-widest text-[#6B7068] uppercase px-3 pb-1">
            Studio Navigation
          </span>
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all active:scale-[0.98]",
                  active
                    ? "bg-white text-[#161716] shadow-xs font-semibold"
                    : "text-[#6B7068] hover:text-[#161716] hover:bg-white/50"
                )}
              >
                <span>{link.label}</span>
                <span className="text-xs text-[#6B7068]">›</span>
              </Link>
            );
          })}

          <div className="my-3 border-t border-[#E2DCD2]/60" />

          <span className="text-[10px] font-semibold font-mono tracking-widest text-[#6B7068] uppercase px-3 pb-1">
            Client Sanctuary
          </span>

          {user && (
            <>
              <Link
                href="/account/wishlist"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-[#6B7068] hover:text-[#161716] hover:bg-white/50 transition-all"
              >
                <span>Saved Wishlist</span>
                <span className="text-xs font-bold text-[#B86A44] font-mono">
                  {wishlistItems.length}
                </span>
              </Link>
              <Link
                href="/account/notifications"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-[#6B7068] hover:text-[#161716] hover:bg-white/50 transition-all"
              >
                <span className="flex items-center gap-2">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-[#4A5E4C] px-2 py-0.5 text-[10px] font-semibold text-white">
                      {unreadCount} unread
                    </span>
                  )}
                </span>
                <span className="text-xs text-[#6B7068]">›</span>
              </Link>
            </>
          )}

          <Link
            href="/cart"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-[#6B7068] hover:text-[#161716] hover:bg-white/50 transition-all"
          >
            <span>Shopping Bag</span>
            <span className="text-xs text-[#6B7068]">›</span>
          </Link>

          {user ? (
            <>
              <Link
                href="/account"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-[#161716] bg-white/70 shadow-xs"
              >
                <span>My Account ({user.fullName.split(" ")[0]})</span>
                <span className="text-xs text-[#6B7068]">›</span>
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-[#4A5E4C] bg-[#4A5E4C]/10"
                >
                  <span>Admin Portal</span>
                  <span className="text-xs text-[#4A5E4C]">↗</span>
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  logout();
                  setDrawerOpen(false);
                }}
                className="mt-2 text-left px-4 py-3 rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50/60 transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="mt-4 space-y-2">
              <Link
                href="/login"
                onClick={() => setDrawerOpen(false)}
                className="block text-center w-full py-3 rounded-2xl text-xs font-semibold text-[#161716] border border-[#E2DCD2] bg-white/60 hover:bg-white"
              >
                Sign In
              </Link>
              <Link
                href="/design-consultation"
                onClick={() => setDrawerOpen(false)}
                className="block text-center w-full py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider text-white bg-[#161716] hover:bg-[#374739] shadow-xs"
              >
                Book Consultation ↗
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
