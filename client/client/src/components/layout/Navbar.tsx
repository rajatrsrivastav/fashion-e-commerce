import { useState } from "react";
import { Link } from "wouter";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@assets/generated_images/minimalist_fashion_logo_v.png";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link href="/" className="text-sm font-medium hover:text-gray-500 transition-colors">Home</Link>
      <Link href="/shop" className="text-sm font-medium hover:text-gray-500 transition-colors">Shop</Link>
      <Link href="/orders" className="text-sm font-medium hover:text-gray-500 transition-colors">Orders</Link>
      <Link href="/best-selling" className="text-sm font-medium hover:text-gray-500 transition-colors">Best Selling</Link>
      <Link href="/trending" className="text-sm font-medium hover:text-gray-500 transition-colors">Trending</Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Desktop Navigation - Left */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-10">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo - Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-black flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300">
              <img src={logo} alt="Vella Vibe" className="w-full h-full object-cover" />
            </div>
          </Link>
        </div>

        {/* Actions - Right */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="I'm looking for..." 
              className="pl-10 h-10 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-gray-200 rounded-full transition-all duration-300"
            />
          </div>

          <button className="hover:text-gray-600 transition-colors">
            <User className="h-5 w-5" />
          </button>
          <button className="hover:text-gray-600 transition-colors relative group">
            <Heart className="h-5 w-5 group-hover:text-red-500 transition-colors" />
            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
          <button className="hover:text-gray-600 transition-colors relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
