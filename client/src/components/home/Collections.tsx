import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Collections() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        // Handle both simple array or object with categories property
        const cats = Array.isArray(data) ? data : (data.categories || []);
        setCategories(cats);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (categoryName) => {
    setLocation(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading && categories.length === 0) {
    return null; // Or a skeleton loader
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Top Collections</h2>
          <Link href="/shop">
            <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto cursor-pointer hover:text-black transition-colors">
              Express your style with our standout collection—fashion meets sophistication.
            </p>
          </Link>
        </div>

        <div className="relative px-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {categories.map((item, idx) => (
                <CarouselItem key={idx} className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6">
                  <div 
                    onClick={() => handleCategoryClick(item.name)}
                    className="flex flex-col items-center gap-4 group cursor-pointer p-2"
                  >
                    <motion.div 
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-black transition-all p-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                        <img 
                          src={item.imageUrl || "/placeholder-category.png"} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </motion.div>
                    <span className="font-medium text-sm md:text-base tracking-wide">{item.name}</span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
