import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Heart,
  Share2,
  Truck,
  RotateCcw,
  Shield,
  Minus,
  Plus,
  ChevronRight,
  Star,
  Loader2
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Image } from "@unpic/react";

export default function ProductDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Standard");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.product) {
            setProduct(data.product);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching product:', err);
          setLoading(false);
        });
    }
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const token = localStorage.getItem('userToken');
      if (!token || !id) return;

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
  const addToCart = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', `/product/${id}`);
      setLocation('/login');
      return;
    }

    if (!product || product.stock === 0) {
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
        body: JSON.stringify({
          productId: parseInt(id!),
          quantity: quantity
        }),
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
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Toggle wishlist
  const toggleWishlist = async () => {
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
            ? `${product.name} has been added to your wishlist`
            : `${product.name} has been removed from your wishlist`,
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

  // Buy Now - Redirect to checkout with this product
  const buyNow = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', `/product/${id}`);
      setLocation('/login');
      return;
    }

    if (!product || product.stock === 0) {
      toast({
        title: 'Out of Stock',
        description: 'This product is currently out of stock',
        variant: 'destructive',
      });
      return;
    }

    // Store buy now item in session storage
    const buyNowItem = {
      productId: parseInt(id!),
      quantity: quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images || [product.imageUrl]
      }
    };
    sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    setLocation('/checkout?buyNow=true');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link href="/shop" className="text-blue-500 hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const colors = ["Black", "White", "Grey"];
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-400">{product.category.name}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-4">
            <motion.div 
              className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Image
                src={images[activeImage]}
                alt={product.name}
                layout="fullWidth"
                className="w-full h-full object-cover"
                background="auto"
              />
              <Badge className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm font-bold uppercase tracking-wider">
                Sale
              </Badge>
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 transition-all ${
                    activeImage === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx}`} layout="fullWidth" className="w-full h-full object-cover" background="auto" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold uppercase tracking-widest text-gray-500">{product.category.name}</span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold text-black">4.8</span>
                  <span className="text-xs text-gray-400">(124 reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-black">₹{product.price.toLocaleString()}</span>
                <span className="text-xl text-gray-400 line-through">₹{(product.price * 1.5).toLocaleString()}</span>
                <Badge variant="outline" className="border-green-500 text-green-600 font-bold">
                  33% OFF
                </Badge>
              </div>
              <p className="text-gray-500 leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <label className="text-sm font-bold uppercase tracking-widest block mb-4">Color: {selectedColor}</label>
                <div className="flex gap-3">
                  {colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color ? 'border-black p-0.5' : 'border-transparent'
                      }`}
                    >
                      <div 
                        className="w-full h-full rounded-full" 
                        style={{ backgroundColor: color.toLowerCase() }} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold uppercase tracking-widest">Size</label>
                  <button className="text-xs font-bold underline hover:text-gray-600 transition-colors">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[60px] h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                        selectedSize === size 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-200 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex flex-1 gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={toggleWishlist}
                          disabled={isTogglingWishlist}
                          variant="outline"
                          size="icon"
                          className={`h-12 w-12 rounded-xl border-2 transition-all duration-300 ${
                            isInWishlist 
                              ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-600' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {isTogglingWishlist ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <motion.div
                              animate={{ 
                                scale: isTogglingWishlist ? [1, 1.2, 1] : 1,
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <Heart 
                                className={`w-5 h-5 transition-all duration-300 ${
                                  isInWishlist ? 'fill-current' : ''
                                }`} 
                              />
                            </motion.div>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-gray-200">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={addToCart}
                  disabled={isAddingToCart || !product || product.stock === 0}
                  className="flex-1 h-14 text-lg font-bold bg-black text-white hover:bg-gray-800 rounded-xl shadow-xl shadow-gray-200 transition-all active:scale-95"
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : product && product.stock === 0 ? (
                    'OUT OF STOCK'
                  ) : (
                    'ADD TO CART'
                  )}
                </Button>
                <Button 
                  onClick={buyNow}
                  disabled={!product || product.stock === 0}
                  variant="outline" 
                  className="flex-1 h-14 text-lg font-bold border-2 border-black rounded-xl transition-all active:scale-95"
                >
                  BUY IT NOW
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-y-2 border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-none mb-1">FREE SHIPPING</p>
                    <p className="text-[10px] text-gray-500">On all orders above ₹999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-none mb-1">7 DAYS RETURN</p>
                    <p className="text-[10px] text-gray-500">Hassle free returns policy</p>
                  </div>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details" className="border-b border-gray-100">
                  <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline">Product Details</AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                    Premium quality street wear designed for maximum comfort and style. Features reinforced stitching at key stress points and high-definition print quality that lasts wash after wash.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping" className="border-b border-gray-100">
                  <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline">Shipping & Returns</AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                    Usually ships within 24-48 hours. Express delivery available for metropolitan areas. Easy 7-day return policy for unused items with original tags.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
