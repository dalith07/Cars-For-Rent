"use client";

import { motion } from "framer-motion";
import { Car } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-100 flex flex-col 
      items-center justify-center bg-[#0a0f1f] text-white 
      overflow-hidden"
    >
      {/* Background glowing lights */}
      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.25),transparent_70%)]"
      />

      <motion.div
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(14,165,233,0.25),transparent_70%)]"
      />

      {/* Car Lane */}
      <div className="relative w-full h-32 overflow-hidden">
        <motion.div
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{
            duration: 6,       // ⬅️ SLOWER SPEED
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Car className="w-16 h-16 text-blue-400 drop-shadow-xl" />
        </motion.div>
      </div>
    </div>
  );
}
