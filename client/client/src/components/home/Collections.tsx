import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Using dummy images for now, would replace with generated category specific ones
import img1 from "@assets/generated_images/oversized_sage_green_tee.png";
import img2 from "@assets/generated_images/oversized_black_graphic_tee.png";
import img3 from "@assets/generated_images/oversized_maroon_tee.png";

const collections = [
  { name: "Men", image: img2 },
  { name: "Womens", image: img1 },
  { name: "Anime", image: img3 },
  { name: "Hoodies", image: img2 },
  { name: "Oversize", image: img1 },
  { name: "Sleeveless", image: img3 },
  { name: "Accessories", image: img2 },
  { name: "New Arrivals", image: img1 },
];

export default function Collections() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Top Collections</h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Express your style with our standout collection—fashion meets sophistication.
          </p>
        </div>

        <div className="relative px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {collections.map((item, idx) => (
                <CarouselItem key={idx} className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6">
                  <div className="flex flex-col items-center gap-4 group cursor-pointer p-2">
                    <motion.div 
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-black transition-all p-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </motion.div>
                    <span className="font-medium text-sm md:text-base tracking-wide">{item.name}</span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
