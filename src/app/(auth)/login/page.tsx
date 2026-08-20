'use client'

import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import LoginFormSection from './LoginFormSection'

const EASE = [0.25, 0.1, 0.25, 1] as const

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
}

export default function Login() {
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

        {/* Dark overlay — same treatment as before, just sitting on the photo now */}
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
            src="/img_ivp/ivp_logo.png"
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
            Welcome Back to <span className="text-white">IVP Africa</span>
          </motion.h1>
          <motion.p variants={item} className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Connecting talent with opportunity across Africa. Sign in to pick up
            right where you left off.
          </motion.p>
        </motion.div>
      </div>

      <LoginFormSection />
    </div>
  )
}