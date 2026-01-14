import { motion } from "framer-motion";
import { Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  discount?: number;
}

export default function ProductCard({ title, price, originalPrice, image, category, discount }: ProductCardProps) {
  return (
    <motion.div 
      className="group relative flex flex-col gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
        {/* Discount Badge */}
        {discount && (
          <Badge className="absolute top-3 left-3 bg-[hsl(0,72%,51%)] text-white hover:bg-[hsl(0,72%,45%)] rounded-sm px-2 py-1 text-xs font-bold z-10">
            -{discount}%
          </Badge>
        )}

        {/* Product Image */}
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        
        <div className="absolute bottom-4 left-0 right-0 px-4 flex gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button className="flex-1 bg-white text-black hover:bg-black hover:text-white transition-colors shadow-lg" size="sm">
            <ShoppingCart className="w-4 h-4 mr-2" /> Add
          </Button>
          <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white shadow-lg">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-medium text-base truncate pr-2 group-hover:text-gray-600 transition-colors">{title}</h3>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{category}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-[hsl(0,72%,51%)]">Rs. {price.toFixed(2)}</span>
          <span className="text-gray-400 text-sm line-through decoration-gray-400">Rs. {originalPrice.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}
