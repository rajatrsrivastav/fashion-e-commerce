import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Filters from "@/components/shop/Filters";
import ProductCard from "@/components/shop/ProductCard";
import Collections from "@/components/home/Collections";
import Recommendations from "@/components/home/Recommendations";
import { Separator } from "@/components/ui/separator";

// Import images
import img1 from "@assets/generated_images/oversized_sage_green_tee.png";
import img2 from "@assets/generated_images/oversized_black_graphic_tee.png";
import img3 from "@assets/generated_images/oversized_maroon_tee.png";

// Mock Data for the Shop Grid
const shopProducts = [
  {
    id: "1",
    title: "Serenity Flow: Oversized 280GSM French Terry Tee in Jade",
    price: 649.00,
    originalPrice: 1499.00,
    image: img1,
    category: "Oversize",
    discount: 57
  },
  {
    id: "2",
    title: "Midnight Drift: Oversized 280GSM French Terry Tee in Black",
    price: 699.00,
    originalPrice: 1499.00,
    image: img2,
    category: "Oversize",
    discount: 53
  },
  {
    id: "3",
    title: "Chillwave Vibe: Oversized 280GSM French Terry Tee",
    price: 699.00,
    originalPrice: 1499.00,
    image: img3,
    category: "Oversize",
    discount: 53
  },
  {
    id: "4",
    title: "Lavender Haze: Basic Oversized Tee",
    price: 599.00,
    originalPrice: 1299.00,
    image: img1,
    category: "Basics",
    discount: 50
  },
  {
    id: "5",
    title: "Sky Blue Dreams: Summer Collection",
    price: 749.00,
    originalPrice: 1599.00,
    image: img3,
    category: "Summer",
    discount: 53
  },
  {
    id: "6",
    title: "Stealth Mode: All Black Essential",
    price: 899.00,
    originalPrice: 1899.00,
    image: img2,
    category: "Premium",
    discount: 53
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Main Shop Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="w-full lg:w-64 hidden lg:block shrink-0">
             <Filters />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {shopProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
             </div>
          </div>

        </div>
      </main>

      <Separator className="my-8 container mx-auto" />

      {/* Top Collections */}
      <Collections />

      {/* Recommendations */}
      <Recommendations />

      {/* Footer Simple */}
      <footer className="bg-black text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">© 2026 VELLA VIBE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
