// app/fonts.ts

import { Manrope, Plus_Jakarta_Sans } from "next/font/google";

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});