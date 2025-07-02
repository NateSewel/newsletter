import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Logo({
  variant = "light",
  href = "/",
  className = "",
  isCollapsed = false,
}: {
  variant?: "dark" | "light";
  href?: string;
  className?: string;
  isCollapsed?: boolean;
}) {
  const primaryColor = variant === "light" ? "text-[#1a1d29]" : "text-white";
  const accentColor = "text-[#3b82f6]"; // Blue accent for API theme
  // const secondaryAccent = "text-[#10b981]"; // Green accent for success/data

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 transition-all",
        isCollapsed ? "justify-center" : "",
        className
      )}
    >
      {/* Logo Mark - Database/API icon with layered design */}
      <div className="relative h-10 w-10 flex-shrink-0">
        <motion.div
          className={cn(
            "rounded-lg flex items-center justify-center relative overflow-hidden",
            "bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]", // Blue gradient
            "shadow-lg",
            isCollapsed ? "h-10 w-10" : "h-10 w-10"
          )}
          initial={false}
          animate={
            isCollapsed
              ? {
                  scale: [1, 1.05, 1],
                  transition: { duration: 2, repeat: Infinity },
                }
              : { scale: 1 }
          }
        >
          {/* Database layers symbol */}
          <motion.div
            className="relative flex flex-col items-center justify-center"
            initial={false}
            animate={
              isCollapsed
                ? {
                    y: [-1, 1, -1],
                    transition: { duration: 2, repeat: Infinity },
                  }
                : { y: 0 }
            }
          >
            {/* Top database layer */}
            <div className="w-6 h-1.5 bg-white rounded-full mb-0.5 opacity-90" />
            {/* Middle database layer */}
            <div className="w-5 h-1.5 bg-white/80 rounded-full mb-0.5" />
            {/* Bottom database layer */}
            <div className="w-4 h-1.5 bg-white/70 rounded-full" />
          </motion.div>

          {/* API connection dots animation */}
          <motion.div
            className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#10b981] rounded-full"
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
              transition: { duration: 1.5, repeat: Infinity, delay: 0 },
            }}
          />
          <motion.div
            className="absolute bottom-1 right-1 w-1 h-1 bg-[#10b981] rounded-full"
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
              transition: { duration: 1.5, repeat: Infinity, delay: 0.5 },
            }}
          />

          {/* Glow effect when collapsed */}
          {isCollapsed && (
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{
                background:
                  "linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3))",
              }}
              animate={{
                opacity: [0, 0.5, 0],
                transition: { duration: 2, repeat: Infinity },
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Text part - Brand name */}
      {!isCollapsed && (
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-baseline">
            <span className={cn("text-lg font-bold", primaryColor)}>Excel</span>
            <span className={cn("text-lg font-bold", accentColor)}>API</span>
          </div>
          <span
            className={cn(
              "text-xs tracking-wider uppercase -mt-1 font-medium",
              variant === "light" ? "text-gray-500" : "text-gray-400"
            )}
          >
            STUDIO
          </span>
        </motion.div>
      )}
    </Link>
  );
}
