"use client";

import { motion } from "framer-motion";
import { Monitor } from "lucide-react";

interface ProjectMockupContentProps {
  title: string;
  gradient: string;
  videoSrc?: string;
  imageSrc?: string;
}

export default function ProjectMockupContent({
  title,
  gradient,
  videoSrc,
  imageSrc,
}: ProjectMockupContentProps) {
  // If video source is provided, render video
  if (videoSrc) {
    return (
      <div className="w-full h-full relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            objectPosition: "center top",
          }}
        >
          <source src={videoSrc} type="video/webm" />
          <source src={videoSrc.replace('.webm', '.mp4')} type="video/mp4" />
        </video>
      </div>
    );
  }

  // If image source is provided, render image
  if (imageSrc) {
    return (
      <div className="w-full h-full relative overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
          style={{
            objectPosition: "center top",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}
    >
      {/* Animated Background Pattern */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.1,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Content Preview */}
      <div
        className="relative z-10 text-center text-white"
        style={{
          padding: "32px",
        }}
      >
        <Monitor
          className="mx-auto opacity-80"
          style={{
            width: "64px",
            height: "64px",
            marginBottom: "16px",
          }}
        />
        <h4
          className="font-semibold"
          style={{
            fontSize: "1.25rem",
            lineHeight: "1.75rem",
            marginBottom: "8px",
          }}
        >
          {title}
        </h4>
        <p
          className="opacity-80"
          style={{
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          }}
        >
          Interactive Demo
        </p>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bg-white/20 rounded-lg"
        style={{
          top: "16px",
          right: "16px",
          width: "32px",
          height: "32px",
        }}
      />
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bg-white/20 rounded-full"
        style={{
          bottom: "32px",
          left: "32px",
          width: "24px",
          height: "24px",
        }}
      />
    </div>
  );
}
