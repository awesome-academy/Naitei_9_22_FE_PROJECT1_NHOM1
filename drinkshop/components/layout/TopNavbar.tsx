"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";

const navItems = [
  { href: "/account", label: "Tài khoản của tôi" },
  { href: "/account/orders", label: "Trạng thái đơn hàng" },
  { href: "/account/wishlist", label: "Danh sách ưa thích" },
  { href: "/cart", label: "Giỏ hàng" },
  { href: "/login", label: "Đăng nhập" },
  { href: "/register", label: "Đăng ký" },
];

const TopNavbar = () => {
  return (
    <nav className="w-full bg-white border-b px-72">
      <div className="flex justify-between items-center h-7 text-xs tracking-tight">
        <div className="flex items-center space-x-6 text-black">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-6">
          <Input
            className="placeholder:text-xs placeholder:italic placeholder:text-gray-400 border-none focus-visible:ring-0"
            placeholder="Tìm kiếm ở đây..."
          />
          <Search className="size-4 cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
