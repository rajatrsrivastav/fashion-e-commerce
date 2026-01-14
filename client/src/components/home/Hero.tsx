import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] bg-black overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src='./HERO.png' 
          alt="Streetwear Collection" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Decorative Logo Mark */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6"
          >
             <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-white stroke-[2px]">
                <path d="M20 20 L50 80 L80 20" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="50" cy="50" r="45" strokeOpacity="0.5" />
             </svg>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-widest mb-4 font-sans">
            VYRAL
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 tracking-[0.2em] font-light italic font-serif">
            Wear What’s Vyral
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 max-w-lg text-gray-400 text-sm md:text-base leading-relaxed"
          >
            There is always an answer to anything and it is better to let nature take its course than to worry about it.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
