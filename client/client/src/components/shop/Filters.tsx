import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";

export default function Filters() {
  const [priceRange, setPriceRange] = useState([0, 799]);

  return (
    <div className="w-full space-y-6 pr-6">
      <Accordion type="single" collapsible defaultValue="availability" className="w-full">
        
        {/* Availability */}
        <AccordionItem value="availability" className="border-b-0 mb-4">
          <AccordionTrigger className="text-base font-bold hover:no-underline py-2">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" defaultChecked />
                <Label htmlFor="in-stock" className="text-sm font-normal text-gray-600 cursor-pointer">In stock (173)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="out-of-stock" disabled />
                <Label htmlFor="out-of-stock" className="text-sm font-normal text-gray-400 cursor-pointer">Out of stock (0)</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price" className="border-b-0 mb-4" defaultValue="price">
          <AccordionTrigger className="text-base font-bold hover:no-underline py-2">Price</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 px-1 pb-6 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="border border-gray-200 rounded px-3 py-2 w-full text-center text-sm">₹ {priceRange[0]}</div>
                <div className="text-gray-400">-</div>
                <div className="border border-gray-200 rounded px-3 py-2 w-full text-center text-sm">₹ {priceRange[1]}</div>
              </div>
              
              <Slider 
                defaultValue={[0, 799]} 
                max={1500} 
                step={10} 
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-4"
              />
              
              <p className="text-xs text-gray-500 font-medium">
                Price: Rs. {priceRange[0]}.00 - Rs. {priceRange[1]}.00
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

         {/* Featured */}
         <AccordionItem value="featured" className="border-b-0">
          <AccordionTrigger className="text-base font-bold hover:no-underline py-2">Featured product</AccordionTrigger>
          <AccordionContent>
             {/* Content */}
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
