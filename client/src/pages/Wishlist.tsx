import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Trash2, Loader2, ShoppingCart } from "lucide-react";

interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
}

export default function Wishlist() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', '/wishlist');
      setLocation('/login');
      return;
    }
    fetchWishlistItems();
  }, [setLocation]);

  // Fetch wishlist items
  const fetchWishlistItems = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:4000/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.wishlistItems);
      } else if (response.status === 401) {
        localStorage.removeItem('userToken');
        setLocation('/login');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wishlist items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId: number) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:4000/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchWishlistItems(); // Refresh wishlist
        toast({
          title: 'Item removed',
          description: 'Item has been removed from your wishlist',
        });
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item',
        variant: 'destructive',
      });
    }
  };

  // Add to cart
  const addToCart = async (product: WishlistItem['product']) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:4000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (response.ok) {
        toast({
          title: 'Added to cart',
          description: `${product.name} has been added to your cart`,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add item to cart',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-black">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">My Wishlist</span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold mb-6">My Wishlist ({wishlistItems.length} items)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group relative border rounded-xl overflow-hidden">
                <Link href={`/product/${item.product.id}`}>
                  <div className="aspect-[3/4] bg-gray-100">
                    <img
                      src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/placeholder.png'}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => removeFromWishlist(item.product.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
                <div className="p-4">
                  <h4 className="font-medium text-sm line-clamp-2 mb-2">{item.product.name}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-red-500">₹{item.product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-400 line-through">₹{(item.product.price * 1.5).toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={() => addToCart(item.product)}
                    className="w-full bg-black hover:bg-gray-800"
                    disabled={item.product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {item.product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {wishlistItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Your wishlist is empty</p>
              <Link href="/shop">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">© 2026 VYRAL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}