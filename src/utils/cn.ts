import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Tell tailwind-merge about the custom names in index.css,
// so text-h1 is a font size (not a color) and font-regular is a weight (not a font family)
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["h1", "h2", "h3", "h4", "h5", "h6", "body", "small", "somep"],
      "font-weight": ["regular"],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
