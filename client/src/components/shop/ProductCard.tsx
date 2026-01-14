import { motion } from "framer-motion";
import { Eye, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const displayImage = images && images.length > 0 ? images[0] : imageUrl;

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
      const response = await fetch('http://localhost:4000/cart', {
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

  // Add to wishlist
  const addToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    const token = localStorage.getItem('userToken');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', `/product/${id}`);
      setLocation('/login');
      return;
    }

    setIsAddingToWishlist(true);
    try {
      const response = await fetch('http://localhost:4000/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Added to wishlist',
          description: `${name} has been added to your wishlist`,
        });
      } else if (response.status === 400 && data.error === 'Item already in wishlist') {
        toast({
          title: 'Already in wishlist',
          description: `${name} is already in your wishlist`,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add item to wishlist',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to wishlist',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToWishlist(false);
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
          <img 
            src={displayImage} 
            alt={name} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              // Fallback image if image fails to load
              e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image';
            }}
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
        <Button
          onClick={addToWishlist}
          disabled={isAddingToWishlist}
          variant="secondary"
          size="sm"
          className="bg-white/90 hover:bg-white shadow-lg"
        >
          <Heart className={`w-4 h-4 ${isAddingToWishlist ? 'animate-pulse' : ''}`} />
        </Button>
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
