import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Image } from "@unpic/react";
import api from "@/lib/api";
import {
  ChevronRight,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ShoppingBag,
  Loader2
} from "lucide-react";

interface OrderItem {
  id: string;
  title: string;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  address: string;
  trackingSteps: Array<{
    status: string;
    date: string;
    completed: boolean;
  }>;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "bg-green-100 text-green-700";
    case "shipped": return "bg-blue-100 text-blue-700";
    case "processing": return "bg-yellow-100 text-yellow-700";
    case "cancelled": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered": return <CheckCircle2 className="w-4 h-4" />;
    case "shipped": return <Truck className="w-4 h-4" />;
    case "processing": return <Clock className="w-4 h-4" />;
    default: return <Package className="w-4 h-4" />;
  }
};

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, token, isLoading: authLoading } = useAuth();

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    },
    enabled: isAuthenticated && !!token,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to view your orders.",
        variant: "destructive",
      });
      setLocation('/login');
    }
  }, [isAuthenticated, authLoading, setLocation, toast]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load orders. Please try again.</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter((o: Order) => o.status !== "delivered" && o.status !== "cancelled");
  const completedOrders = orders.filter((o: Order) => o.status === "delivered" || o.status === "cancelled");

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="w-20 h-20 mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
          <p className="text-gray-500 mb-8">You haven't placed any orders yet. Start shopping!</p>
          <Link href="/shop">
            <Button className="bg-black hover:bg-gray-800">
              Start Shopping
            </Button>
          </Link>
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
            <span className="text-black">My Orders</span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.map((order: Order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                isExpanded={selectedOrder === order.id}
                onToggle={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeOrders.length === 0 ? (
              <EmptyState message="No active orders" />
            ) : (
              activeOrders.map((order: Order) => (
                <OrderCard 
                  key={order.id} 
                  order={order}
                  isExpanded={selectedOrder === order.id}
                  onToggle={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedOrders.length === 0 ? (
              <EmptyState message="No completed orders" />
            ) : (
              completedOrders.map((order: Order) => (
                <OrderCard 
                  key={order.id} 
                  order={order}
                  isExpanded={selectedOrder === order.id}
                  onToggle={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 bg-white rounded-xl">
      <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
}

function OrderCard({ order, isExpanded, onToggle }: OrderCardProps) {
  return (
    <motion.div 
      layout
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      {/* Order Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
              <Image
                src={order.items[0].image}
                alt=""
                layout="fullWidth"
                className="w-full h-full object-cover"
                background="auto"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">Order #{order.id}</h3>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{order.date}</p>
              <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-lg">₹{order.total.toFixed(2)}</p>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t"
        >
          {/* Order Items */}
          <div className="p-6 border-b">
            <h4 className="font-semibold mb-4">Order Items</h4>
            <div className="space-y-4">
              {order.items.map((item: OrderItem) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.title} layout="fullWidth" className="w-full h-full object-cover" background="auto" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{item.title}</h5>
                    <p className="text-sm text-gray-500">{item.size} / {item.color}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-medium mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking */}
          <div className="p-6 border-b">
            <h4 className="font-semibold mb-4">Order Tracking</h4>
            <div className="relative">
              {order.trackingSteps.map((step: { status: string; date: string; completed: boolean }, idx: number) => (
                <div key={idx} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                    {idx < order.trackingSteps.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-1 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className={`font-medium ${step.completed ? 'text-black' : 'text-gray-400'}`}>
                      {step.status}
                    </p>
                    {step.date && (
                      <p className="text-sm text-gray-500">{step.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Shipping Address
            </h4>
            <p className="text-gray-600">{order.address}</p>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 flex flex-wrap gap-3">
            {order.status === "delivered" && (
              <>
                <Button variant="outline" size="sm">Write a Review</Button>
                <Button variant="outline" size="sm">Request Return</Button>
              </>
            )}
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <Button variant="outline" size="sm">Track Package</Button>
            )}
            <Button variant="outline" size="sm">Download Invoice</Button>
            <Link href="/shop">
              <Button size="sm" className="bg-black hover:bg-gray-800">Buy Again</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
