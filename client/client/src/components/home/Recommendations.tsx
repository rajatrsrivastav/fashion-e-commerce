import ProductCard from "../shop/ProductCard";
import img1 from "@assets/generated_images/oversized_sage_green_tee.png";
import img2 from "@assets/generated_images/oversized_black_graphic_tee.png";
import img3 from "@assets/generated_images/oversized_maroon_tee.png";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const products = [
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
    title: "Urban Legend: Graphic Print Heavy Cotton",
    price: 799.00,
    originalPrice: 1699.00,
    image: img2,
    category: "Graphic",
    discount: 50
  },
  {
    id: "5",
    title: "Lavender Haze: Basic Oversized Tee",
    price: 599.00,
    originalPrice: 1299.00,
    image: img1,
    category: "Basics",
    discount: 50
  },
];

export default function Recommendations() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                  <ProductCard {...product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

       {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button 
          size="icon" 
          onClick={scrollToTop}
          className="h-12 w-12 rounded-full shadow-xl bg-white text-black hover:bg-gray-100 border border-gray-200"
        >
           <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
