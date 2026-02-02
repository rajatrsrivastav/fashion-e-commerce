import { motion } from "framer-motion";
import { Eye, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Image } from "@unpic/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  stock: number;
  category: {
    name: string;
  };
}

export default function ProductCard({ id, name, price, imageUrl, images, category, stock }: ProductCardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const displayImage = images && images.length > 0 ? images[0] : imageUrl;

  // Check if product is in wishlist on mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/wishlist/${id}/check`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsInWishlist(data.isInWishlist);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [id]);

  // Add to cart
  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    const token = localStorage.getItem('userToken');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', `/product/${id}`);
      setLocation('/login');
      return;
    }

    if (stock === 0) {
      toast({
        title: 'Out of Stock',
        description: 'This product is currently out of stock',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      if (response.ok) {
        toast({
          title: 'Added to cart',
          description: `${name} has been added to your cart`,
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
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    const token = localStorage.getItem('userToken');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', `/product/${id}`);
      setLocation('/login');
      return;
    }

    setIsTogglingWishlist(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/wishlist/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIsInWishlist(data.isInWishlist);
        toast({
          title: data.isInWishlist ? 'Added to wishlist' : 'Removed from wishlist',
          description: data.isInWishlist 
            ? `${name} has been added to your wishlist`
            : `${name} has been removed from your wishlist`,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update wishlist',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update wishlist',
        variant: 'destructive',
      });
    } finally {
      setIsTogglingWishlist(false);
    }
  };
  
  return (
    <motion.div 
      className="group relative flex flex-col gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${id}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 cursor-pointer">
          {/* Product Image */}
          <Image
            src={displayImage || 'https://via.placeholder.com/400x500?text=No+Image'}
            alt={name}
            layout="fullWidth"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            background="auto"
          />

          {/* Hover Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </Link>
      
      <div className="absolute bottom-[120px] left-0 right-0 px-4 flex gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
        <Button
          onClick={addToCart}
          disabled={isAddingToCart || stock === 0}
          className="flex-1 bg-white text-black hover:bg-black hover:text-white transition-colors shadow-lg"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isAddingToCart ? 'Adding...' : stock === 0 ? 'Out of Stock' : 'Add'}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleWishlist}
                disabled={isTogglingWishlist}
                variant="secondary"
                size="sm"
                className={`bg-white/90 hover:bg-white shadow-lg transition-all duration-300 ${
                  isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-gray-700'
                }`}
              >
                <motion.div
                  animate={{ 
                    scale: isTogglingWishlist ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart 
                    className={`w-4 h-4 transition-all duration-300 ${
                      isInWishlist ? 'fill-current' : ''
                    }`} 
                  />
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Link href={`/product/${id}`}>
          <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white shadow-lg">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        <Link href={`/product/${id}`}>
          <h3 className="font-medium text-base truncate pr-2 group-hover:text-gray-600 transition-colors cursor-pointer">{name}</h3>
        </Link>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{category.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-[hsl(0,72%,51%)]">₹{price.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}
