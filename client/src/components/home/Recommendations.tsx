import ProductCard from "../shop/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useApi";

export default function Recommendations() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { data: products, isLoading } = useProducts();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const shouldShow = scrollTop > 300 || (scrollTop + windowHeight) >= (documentHeight - 100);
      setShowScrollTop(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-20 bg-gray-50/50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">You May Like These</h2>
          <p className="text-gray-500 text-sm">Most Viewed Products</p>
        </div>

        <div className="px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <div className="flex flex-col gap-3">
                      <Skeleton className="aspect-[3/4] rounded-xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                products.map((product: any) => (
                  <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <ProductCard {...product} />
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

       {/* Floating Action Button */}
      {showScrollTop && (
        <div className="fixed bottom-8 right-8 z-40">
          <Button 
            size="icon" 
            onClick={scrollToTop}
            className="h-12 w-12 rounded-full shadow-xl bg-white text-black hover:bg-gray-100 border border-gray-200"
          >
             <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      )}
    </section>
  );
}
