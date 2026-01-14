import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Filters from "@/components/shop/Filters";
import ProductCard from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define TypeScript interfaces for our data
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

export default function Shop() {
  // State for products from backend
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridCols, setGridCols] = useState(3);

  // Get category from URL search params
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const categoryParam = params.get('category');

  // Fetch products from backend when component mounts or filters change
  useEffect(() => {
    fetchProducts();
  }, [categoryParam]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Make API call to backend
      const url = categoryParam 
        ? `http://localhost:4000/products?category=${encodeURIComponent(categoryParam)}`
        : 'http://localhost:4000/products';
        
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        // Handle both arrow object and array responses
        const productsArray = Array.isArray(data) ? data : data.products || [];
        setAllProducts(productsArray);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-black">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">Shop</span>
          </nav>
        </div>
      </div>
      
      {/* Page Header */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Shop All</h1>
          <p className="text-gray-500 text-center mt-2">Discover our latest collection</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="w-full lg:w-64 hidden lg:block shrink-0">
            <Filters />
          </aside>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] overflow-y-auto">
                  <div className="mt-6">
                    <Filters />
                  </div>
                </SheetContent>
              </Sheet>

              <p className="text-sm text-gray-500 hidden lg:block">{allProducts.length} products</p>

              <div className="flex items-center gap-4">
                {/* Grid Toggle */}
                <div className="hidden md:flex items-center gap-2 border rounded-lg p-1">
                  <button 
                    onClick={() => setGridCols(2)}
                    className={`p-1.5 rounded ${gridCols === 2 ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setGridCols(3)}
                    className={`p-1.5 rounded ${gridCols === 3 ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort */}
                <Select defaultValue="featured">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="best-selling">Best Selling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-x-6 gap-y-10`}>
              {allProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-12">
              <Button variant="outline" className="px-8">
                Load More
              </Button>
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
