import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/shop/ProductCard";
import Collections from "@/components/home/Collections";
import Recommendations from "@/components/home/Recommendations";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "@unpic/react";
import { useProducts } from "@/hooks/useApi";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: Category;
}

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 4) || [];

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over ₹999"
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "7-day return policy"
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support"
  },
];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Features Bar */}
      <section className="bg-gray-50 py-8 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Collections */}
      <Collections />

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Best Sellers</h2>
              <p className="text-gray-500 mt-2">Our most loved pieces</p>
            </div>
            <Link href="/shop">
              <Button variant="outline" className="hidden md:flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <Skeleton className="aspect-[3/4] rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            )}
          </div>

          <div className="flex justify-center mt-8 md:hidden">
            <Link href="/shop">
              <Button variant="outline" className="flex items-center gap-2">
                View All Products <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">New Season Arrivals</h2>
              <p className="text-gray-400 mb-6">
                Discover the latest trends in streetwear fashion. Premium quality, bold designs, and unmatched comfort.
              </p>
              <Link href="/shop">
                <Button className="bg-white text-black hover:bg-gray-100">
                  Shop New Arrivals
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <Image src="https://images.unsplash.com/photo-1441986300917-64674bd600d8" alt="New Arrival" layout="constrained" width={160} height={208} className="object-cover rounded-xl" />
              <Image src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04" alt="New Arrival" layout="constrained" width={160} height={208} className="object-cover rounded-xl mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <Recommendations />

      {/* Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join the VYRAL Community</h2>
          <p className="text-gray-500 mb-6">
            Subscribe to get exclusive offers, early access to new drops, and style inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-black"
            />
            <Button className="bg-black text-white hover:bg-gray-800 px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-4">VYRAL</h3>
              <p className="text-gray-400 text-sm">
                Premium streetwear brand delivering bold fashion with uncompromising quality.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Best Sellers</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Sale</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Help</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">© 2026 VYRAL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

