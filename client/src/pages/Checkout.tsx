import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChevronRight,
  CreditCard,
  Truck,
  Shield,
  Lock,
  Wallet,
  Building2,
  Loader2
} from "lucide-react";
import { Image } from "@unpic/react";

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

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [saveInfo, setSaveInfo] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");
  
  // Check if this is a Buy Now checkout
  const isBuyNow = new URLSearchParams(window.location.search).get('buyNow') === 'true';
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);

  // Load Buy Now item from session storage
  useEffect(() => {
    if (isBuyNow) {
      const storedItem = sessionStorage.getItem('buyNowItem');
      if (storedItem) {
        try {
          const item = JSON.parse(storedItem);
          setBuyNowItem({
            id: 0, // Temporary ID for buy now
            userId: 0,
            productId: item.productId,
            quantity: item.quantity,
            product: item.product
          });
        } catch (error) {
          console.error('Error parsing buy now item:', error);
        }
      }
    }
  }, [isBuyNow]);

  // Fetch cart items
  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setLocation('/login');
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      return response.json();
    },
    enabled: isAuthenticated,
  });

  const cartItems = Array.isArray(cartData?.cartItems) ? cartData.cartItems : (Array.isArray(cartData) ? cartData : []);

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (address: string) => {
      // If Buy Now, create direct order
      if (isBuyNow && buyNowItem) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/direct`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            productId: buyNowItem.productId,
            quantity: buyNowItem.quantity,
            shippingAddress: address 
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create order');
        }

        return response.json();
      }
      
      // Otherwise, create order from cart
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress: address }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      return response.json();
    },
    onSuccess: (order) => {
      // Clear buy now item from session storage
      if (isBuyNow) {
        sessionStorage.removeItem('buyNowItem');
      }
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${order.id} has been placed.`,
      });
      setLocation('/orders');
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Place Order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', '/checkout');
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  // Redirect to cart if empty (unless Buy Now)
  useEffect(() => {
    if (!isBuyNow && !cartLoading && Array.isArray(cartItems) && cartItems.length === 0) {
      setLocation('/cart');
    }
  }, [cartItems, cartLoading, setLocation, isBuyNow]);

  // Use Buy Now item if available, otherwise use cart items
  const displayItems = isBuyNow && buyNowItem ? [buyNowItem] : cartItems;
  
  const subtotal = Array.isArray(displayItems) ? displayItems.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0) : 0;
  const shipping = subtotal > 1000 ? 0 : 99; // Free shipping over ₹1000
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    if (!shippingAddress.trim()) {
      toast({
        title: "Shipping Address Required",
        description: "Please enter your shipping address.",
        variant: "destructive",
      });
      return;
    }
    createOrderMutation.mutate(shippingAddress);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartLoading && !isBuyNow) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isBuyNow && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Your cart is empty. <Link href="/shop" className="text-blue-600 hover:underline">Continue shopping</Link></p>
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
            <Link href="/cart" className="hover:text-black">Cart</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">Checkout</span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200'}`}>1</span>
                <span className="hidden sm:inline font-medium">Information</span>
              </div>
              <div className="flex-1 h-px bg-gray-200" />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200'}`}>2</span>
                <span className="hidden sm:inline font-medium">Shipping</span>
              </div>
              <div className="flex-1 h-px bg-gray-200" />
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-black' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-black text-white' : 'bg-gray-200'}`}>3</span>
                <span className="hidden sm:inline font-medium">Payment</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" className="mt-1" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Street Name" className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                  <Input id="apartment" placeholder="Apt 4B" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Mumbai" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="Maharashtra" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input id="pincode" placeholder="400001" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="India" defaultValue="India" className="mt-1" />
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox 
                  id="saveInfo" 
                  checked={saveInfo}
                  onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                />
                <Label htmlFor="saveInfo" className="text-sm text-gray-600 cursor-pointer">
                  Save this information for next time
                </Label>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
              <div>
                <Label htmlFor="shippingAddress">Full Shipping Address</Label>
                <textarea
                  id="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your complete shipping address including street, city, state, and PIN code"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Shipping Method</h2>
              <RadioGroup defaultValue="standard" className="space-y-3">
                <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-black transition-colors">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="cursor-pointer">
                      <span className="font-medium">Standard Shipping</span>
                      <p className="text-sm text-gray-500">5-7 business days</p>
                    </Label>
                  </div>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-black transition-colors">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="cursor-pointer">
                      <span className="font-medium">Express Shipping</span>
                      <p className="text-sm text-gray-500">2-3 business days</p>
                    </Label>
                  </div>
                  <span className="font-medium">₹149</span>
                </div>
              </RadioGroup>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-black' : 'hover:border-gray-400'}`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="cursor-pointer flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      <span className="font-medium">Credit / Debit Card</span>
                    </Label>
                  </div>
                </div>
                <div className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-black' : 'hover:border-gray-400'}`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="cursor-pointer flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      <span className="font-medium">UPI</span>
                    </Label>
                  </div>
                </div>
                <div className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'netbanking' ? 'border-black' : 'hover:border-gray-400'}`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="cursor-pointer flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      <span className="font-medium">Net Banking</span>
                    </Label>
                  </div>
                </div>
                <div className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-black' : 'hover:border-gray-400'}`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="cursor-pointer flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      <span className="font-medium">Cash on Delivery</span>
                    </Label>
                  </div>
                  <span className="text-sm text-gray-500">+₹49</span>
                </div>
              </RadioGroup>

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Doe" className="mt-1" />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input id="upiId" placeholder="yourname@upi" className="mt-1" />
                </div>
              )}
            </div>

            {/* Place Order Button */}
            <Button 
              className="w-full h-14 bg-black hover:bg-gray-800 text-lg disabled:opacity-50"
              onClick={handlePlaceOrder}
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Lock className="w-5 h-5 mr-2" />
              )}
              {createOrderMutation.isPending ? 'Placing Order...' : `Place Order - ₹${total.toFixed(2)}`}
            </Button>

            <p className="text-xs text-center text-gray-500">
              By placing this order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {displayItems.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} layout="fullWidth" className="w-full h-full object-cover" background="auto" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium line-clamp-1">{item.product.name}</h3>
                      <p className="text-sm font-medium mt-1">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>Included</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span>Free shipping on orders ₹1000+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
