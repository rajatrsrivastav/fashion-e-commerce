import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "@unpic/react";
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/useApi";

interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
  };
}

export default function Cart() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const { data: cartItems = [], isLoading } = useCart();
  const updateCartMutation = useUpdateCartItem();
  const removeCartMutation = useRemoveFromCart();

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await updateCartMutation.mutateAsync({ productId, quantity: newQuantity });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Error',
        description: 'Failed to update quantity',
        variant: 'destructive',
      });
    }
  };

  const removeItem = async (productId: number) => {
    try {
      await removeCartMutation.mutateAsync(productId);
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart',
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item',
        variant: 'destructive',
      });
    }
  };

  const applyCoupon = () => {
    const validCoupons = ['SAVE10', 'WELCOME20', 'FIRST50'];
    
    if (validCoupons.includes(couponCode.toUpperCase())) {
      setAppliedCoupon(couponCode.toUpperCase());
      toast({
        title: 'Coupon applied!',
        description: `Coupon ${couponCode.toUpperCase()} has been applied to your order.`,
      });
    } else {
      toast({
        title: 'Invalid coupon',
        description: 'The coupon code you entered is not valid.',
        variant: 'destructive',
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = appliedCoupon === 'SAVE10' ? subtotal * 0.1 : 
                  appliedCoupon === 'WELCOME20' ? subtotal * 0.2 : 
                  appliedCoupon === 'FIRST50' ? subtotal * 0.5 : 0;
  const shipping = cartItems.length === 0 ? 0 : (subtotal >= 999 ? 0 : 49);
  const total = subtotal - discount + shipping;

  if (isLoading) {
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
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">Shopping Cart</span>
        </nav>
      </div>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItems.length} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Shipping Banner */}
            {subtotal < 999 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                <Truck className="w-5 h-5 text-yellow-600" />
                <p className="text-sm">
                  Add <strong>₹{(999 - subtotal).toFixed(2)}</strong> more to get <strong>FREE shipping!</strong>
                </p>
              </div>
            )}

            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white border rounded-xl p-4 md:p-6"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link href={`/product/${item.product.id}`}>
                      <div className="w-24 h-32 md:w-32 md:h-40 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'https://via.placeholder.com/300x400?text=No+Image'}
                          alt={item.product.name}
                          layout="fullWidth"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          background="auto"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link href={`/product/${item.product.id}`}>
                          <h3 className="font-medium text-sm md:text-base line-clamp-2 hover:text-gray-600">
                            {item.product.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1 hover:bg-gray-100 rounded-full shrink-0"
                        >
                          <X className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={updateCartMutation.isPending}
                            className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={updateCartMutation.isPending}
                            className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-400 line-through">
                            ₹{((item.product.price * 1.5) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <Link href="/shop">
              <Button variant="outline" className="w-full mt-4">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Coupon Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={applyCoupon}
                    disabled={!couponCode}
                  >
                    Apply
                  </Button>
                </div>
                {appliedCoupon && (
                  <p className="text-sm text-green-600 mt-2">
                    Coupon "{appliedCoupon}" applied! 10% off
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">Try: VYRAL10</p>
              </div>

              <Separator className="my-4" />

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{cartItems.length === 0 ? '₹0.00' : (shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping.toFixed(2)}`)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <Link href="/checkout">
                <Button 
                  className="w-full h-12 bg-black hover:bg-gray-800 text-base"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Free Shipping 999+
                  </span>
                  <span>|</span>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
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
