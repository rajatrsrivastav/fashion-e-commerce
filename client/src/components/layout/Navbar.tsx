import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, Heart, ShoppingBag, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Image } from "@unpic/react";

const logo = "/favicon.png";

export default function Navbar() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user, logout } = useAuth();
  const [isSearchOpen] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
      fetchWishlistCount();
    }
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const totalItems = data.cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchWishlistCount = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistCount(data.wishlistItems.length);
      }
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setCartCount(0);
    setWishlistCount(0);
    setOpenUserMenu(false);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    setLocation('/');
  };

  const NavLinks = () => (
    <>
      {/* <Link href="/shop/men" className="text-sm font-medium hover:text-gray-500 transition-colors">Men</Link>
      <Link href="/shop/women" className="text-sm font-medium hover:text-gray-500 transition-colors">Women</Link>
      <Link href="/shop/kids" className="text-sm font-medium hover:text-gray-500 transition-colors">Kids</Link> */}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Desktop Navigation - Left (Logo + Links) */}
        <div className="flex items-center gap-6">
          <Link href="/">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-black flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300">
              <Image src={logo} alt="VYRAL" layout="fullWidth" className="w-full h-full object-cover" background="auto" />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
          </div>
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

          {/* User dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setOpenUserMenu(!openUserMenu)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </button>

            {openUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 py-3">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 pb-2">
                      <p className="font-semibold text-lg">Hi, {user?.name || 'User'}</p>
                      <p className="text-sm text-gray-500">Manage your account</p>
                    </div>

                    <div className="border-t my-2" />

                    <div className="px-2">
                      <Link href="/profile" className="block px-3 py-2 rounded hover:bg-gray-50">Profile</Link>
                      <Link href="/orders" className="block px-3 py-2 rounded hover:bg-gray-50">Orders</Link>
                      <Link href="/wishlist" className="block px-3 py-2 rounded hover:bg-gray-50">Wishlist</Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-4 pb-2">
                      <p className="font-semibold text-lg">Welcome</p>
                      <p className="text-sm text-gray-500">To access account and manage orders</p>
                      <div className="mt-3 space-y-2">
                        <Link href="/login">
                          <div className="text-center border rounded-md py-2 cursor-pointer hover:bg-gray-50 font-bold text-sm">LOGIN</div>
                        </Link>
                        <Link href="/register">
                          <div className="text-center bg-black text-white rounded-md py-2 cursor-pointer hover:bg-gray-900 font-bold text-sm">SIGN UP</div>
                        </Link>
                      </div>
                    </div>

                    <div className="border-t my-2" />

                    <div className="px-2">
                      <Link href="/orders" className="block px-3 py-2 rounded hover:bg-gray-50">Orders</Link>
                      <Link href="/wishlist" className="block px-3 py-2 rounded hover:bg-gray-50">Wishlist</Link>
                      <Link href="/contact" className="block px-3 py-2 rounded hover:bg-gray-50">Contact Us</Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <Link href="/wishlist" className="hover:text-gray-600 transition-colors relative group">
            <Heart className="h-5 w-5 group-hover:text-red-500 transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="hover:text-gray-600 transition-colors relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
