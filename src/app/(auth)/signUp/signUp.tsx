"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import SignUpFormSection from "@/app/(auth)/signUp/SignUpFormSection";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden lg:flex-row">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-[45%] lg:flex-col lg:justify-between xl:w-1/2">
        {/* Background photo */}
        <Image
          src="/img_ivp/auth.png"
          alt="IVP Africa talent celebrating a new opportunity"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

        {/* Logo — top-left, navbar-style */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-10 flex items-center p-8 xl:p-12"
        >
          <Image
            src="/img_ivp/Ivp_logo.png"
            alt="IVP Africa"
            width={128}
            height={128}
            className="h-32 w-auto object-contain"
            priority
          />
        </motion.div>

        {/* Message — bottom */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col justify-end p-8 xl:p-12"
        >
          <motion.span
            variants={item}
            className="mb-4 inline-block text-xs font-semibold tracking-[0.2em] text-white/60 uppercase"
          >
            Talent Placement Platform
          </motion.span>
          <motion.h1
            variants={item}
            className="text-3xl leading-tight text-white uppercase xl:text-4xl 2xl:text-5xl"
          >
            Join <span className="text-white/60">IVP Africa</span>
          </motion.h1>
          <motion.p variants={item} className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            42,000+ professionals and 1,200+ employers are already here. Your
            seat is waiting.
          </motion.p>
        </motion.div>
      </div>

      <SignUpFormSection />
    </div>
  );
}